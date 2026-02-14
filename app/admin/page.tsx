import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { RegistrationStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggleButton } from "@/components/theme-toggle";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const ESTIMATED_TICKET_PRICE = 75;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalEvents,
    totalBookings,
    totalUsers,
    upcomingEvents,
    recentBookings,
    recentRegistrations,
    checkedInCount,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.registration.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.event.findMany({
      where: { startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        startAt: true,
        capacity: true,
        _count: { select: { registrations: true } },
      },
    }),
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,
        user: { select: { name: true } },
        event: { select: { title: true } },
      },
    }),
    prisma.registration.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.registration.count({
      where: { checkedInAt: { not: null } },
    }),
  ]);

  const projectedRevenue = totalBookings * ESTIMATED_TICKET_PRICE;
  const checkedInRate = totalBookings > 0 ? Math.round((checkedInCount / totalBookings) * 100) : 0;

  const monthlyStats = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: monthLabel(date),
      bookings: 0,
      revenue: 0,
    };
  });

  const monthlyLookup = new Map(monthlyStats.map((entry) => [entry.key, entry]));
  for (const registration of recentRegistrations) {
    const created = new Date(registration.createdAt);
    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const month = monthlyLookup.get(key);
    if (!month) continue;
    month.bookings += 1;
    month.revenue += ESTIMATED_TICKET_PRICE;
  }

  const maxMetric = Math.max(
    1,
    ...monthlyStats.map((entry) => Math.max(entry.bookings, Math.round(entry.revenue / 100)))
  );

  return (
    <main className={`${bodyFont.className} min-h-screen organizer-theme text-[#0d1021]`}>
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="bg-[linear-gradient(180deg,#2b3f66_0%,#1b2a4a_45%,#13223b_100%)] px-5 py-6 text-white">
          <div className="flex items-center gap-3 pb-5">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xs font-semibold uppercase tracking-[0.28em]">
              SE
            </div>
            <div>
              <p className={`${headingFont.className} text-2xl`}>Dashboard</p>
              <p className="text-xs text-white/70">Admin Control</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2 text-sm">
            {[
              "Dashboard",
              "Events",
              "Bookings",
              "Attendees",
              "Analytics",
              "Messages",
              "Settings",
            ].map((item, index) => (
              <div
                key={item}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                  index === 0
                    ? "bg-[#32508f] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>

          <LogoutButton
            containerClassName="mt-4 flex flex-col gap-1"
            className="w-fit rounded-md border border-white/60 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
            errorClassName="text-[11px] text-rose-200"
            redirectTo="/"
          />
        </aside>

        <section className="organizer-content p-5 md:p-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="organizer-top-shadow flex h-11 w-full max-w-xl items-center gap-2 rounded-xl border border-transparent bg-white px-3 shadow-sm">
              <span className="text-[#8b93ad]">?</span>
              <input
                placeholder="Search task"
                className="h-full w-full bg-transparent text-sm text-[#1a1f35] outline-none placeholder:text-[#9aa2b6]"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="organizer-top-shadow organizer-top-shadow-circle">
                <ThemeToggleButton />
              </div>
              <button
                type="button"
                className="organizer-top-shadow grid h-10 w-10 place-items-center rounded-full border border-white bg-white text-sm text-[#51607f] shadow-sm"
                aria-label="Notifications"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 text-[#f2b94b]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 17H9" />
                  <path d="M18 17V11a6 6 0 10-12 0v6" />
                  <path d="M5 17h14" />
                </svg>
              </button>

              <div className="organizer-top-shadow flex items-center gap-3 rounded-full bg-white px-3 py-1.5 shadow-sm">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#f2f4ff] text-sm font-semibold text-[#4a5b87]">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="pr-1 text-xs">
                  <p className="font-semibold text-[#1b2441]">{user.name}</p>
                  <p className="text-[#8b93ad]">{user.email}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="organizer-stat-card rounded-xl bg-gradient-to-r from-[#6a5af9] via-[#7b62ff] to-[#8a74ff] p-4 text-white shadow-md">
              <p className="text-xs text-white/80">Total Events</p>
              <p className="mt-2 text-2xl font-semibold">{totalEvents}</p>
            </article>
            <article className="organizer-stat-card rounded-xl bg-gradient-to-r from-[#6b3b94] via-[#7d4db0] to-[#8d5fc4] p-4 text-white shadow-md">
              <p className="text-xs text-white/80">Total Bookings</p>
              <p className="mt-2 text-2xl font-semibold">{totalBookings}</p>
            </article>
            <article className="organizer-stat-card rounded-xl bg-gradient-to-r from-[#2f7a6b] via-[#2f8c7a] to-[#36a18c] p-4 text-white shadow-md">
              <p className="text-xs text-white/80">Attendees</p>
              <p className="mt-2 text-2xl font-semibold">{totalUsers}</p>
            </article>
            <article className="organizer-stat-card rounded-xl bg-gradient-to-r from-[#f3a652] via-[#f2a142] to-[#f19a2f] p-4 text-white shadow-md">
              <p className="text-xs text-white/80">Projected Revenue</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(projectedRevenue)}</p>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Upcoming Events</h2>
                <span className="text-xs text-[#8b93ad]">Next schedule</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#8b93ad]">
                      <th className="pb-2">Event</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Seats Left</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#243054]">
                    {upcomingEvents.length === 0 ? (
                      <tr>
                        <td className="py-2" colSpan={3}>
                          No upcoming events yet.
                        </td>
                      </tr>
                    ) : (
                      upcomingEvents.map((event) => {
                        const seatsLeft = Math.max(event.capacity - event._count.registrations, 0);
                        return (
                          <tr key={event.id} className="border-t border-[#eef1f7]">
                            <td className="py-2">{event.title}</td>
                            <td className="py-2 text-[#6b7593]">
                              {event.startAt.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-2">
                              <span className="rounded-full bg-[#ede9ff] px-2 py-1 text-xs text-[#5c53d6]">
                                {seatsLeft}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Event Statistics</h2>
                <span className="text-xs text-[#8b93ad]">Last 6 months</span>
              </div>
              <div className="grid h-[220px] grid-cols-6 items-end gap-2 rounded-lg border border-[#eef1f7] bg-[#f9fafe] p-3">
                {monthlyStats.map((month) => {
                  const bookingsHeight = (month.bookings / maxMetric) * 100;
                  const revenueHeight = (Math.round(month.revenue / 100) / maxMetric) * 100;
                  return (
                    <div key={month.key} className="flex h-full flex-col justify-end gap-1">
                      <div
                        className="w-full rounded-sm bg-[#3b5dd0]"
                        style={{ height: `${Math.max(bookingsHeight, 4)}%` }}
                        title={`Bookings: ${month.bookings}`}
                      />
                      <div
                        className="w-full rounded-sm bg-[#f2b94b]"
                        style={{ height: `${Math.max(revenueHeight, 4)}%` }}
                        title={`Revenue: ${formatCurrency(month.revenue)}`}
                      />
                      <p className="pt-1 text-center text-[10px] text-[#7b86a6]">{month.label}</p>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1fr_0.85fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Recent Bookings</h2>
              <div className="mt-3 space-y-2 text-sm">
                {recentBookings.length === 0 ? (
                  <p className="text-[#8b93ad]">No registrations yet.</p>
                ) : (
                  recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2"
                    >
                      <div>
                        <p className="font-medium text-[#243054]">{booking.user.name}</p>
                        <p className="text-xs text-[#7b86a6]">{booking.event.title}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          booking.status === RegistrationStatus.REGISTERED
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Attendee Check-in</h2>
              <div className="mt-5 flex items-center justify-center">
                <div className="grid h-40 w-40 place-items-center rounded-full border-[16px] border-[#3b5dd0] text-center">
                  <div>
                    <p className="text-4xl font-bold text-[#1b2441]">{checkedInRate}%</p>
                    <p className="text-xs text-[#7b86a6]">Checked in</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Tasks</h2>
              <ul className="mt-3 space-y-2 text-sm text-[#2a3659]">
                <li className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2">
                  Send event reminders
                </li>
                <li className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2">
                  Update venue details
                </li>
                <li className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2">
                  Confirm catering order
                </li>
                <li className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2">
                  Review AV setup
                </li>
              </ul>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
