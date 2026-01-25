import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { RegistrationStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";

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
    <main className={`${bodyFont.className} min-h-screen bg-[#090b11] text-[#f3eee6]`}>
      <div className="grid min-h-screen md:grid-cols-[250px_1fr]">
        <aside className="border-r border-[#2a3248] bg-[linear-gradient(180deg,#101a2c_0%,#0a1020_100%)] p-5">
          <div className="flex items-center gap-3 border-b border-[#2a3248] pb-5">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d8b26f] bg-black/40 text-xs tracking-[0.22em] text-[#d8b26f]">
              SE
            </div>
            <div>
              <p className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>Dashboard</p>
              <p className="text-xs text-[#93a1c6]">Admin Control</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2 text-sm">
            {["Dashboard", "Events", "Bookings", "Attendees", "Analytics", "Messages", "Settings"].map(
              (item, index) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-2 ${
                    index === 0
                      ? "bg-[#d8b26f]/20 text-[#f6e7c8]"
                      : "text-[#b4bfdc] hover:bg-[#1a253d] hover:text-[#f6e7c8]"
                  }`}
                >
                  {item}
                </div>
              )
            )}
          </nav>

          <LogoutButton
            containerClassName="mt-6 flex flex-col gap-1"
            className="w-fit rounded-md border border-[#f0f3ff] px-3 py-2 text-xs font-semibold text-[#f8f9ff] transition hover:bg-white/10 disabled:opacity-60"
            errorClassName="text-[11px] text-rose-300"
            redirectTo="/"
          />
        </aside>

        <section className="p-4 md:p-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#2a3248] bg-[#12192a] p-3 md:p-4">
            <div className="flex h-12 w-full max-w-xl items-center gap-2 rounded-xl border border-[#222c48] bg-[#0f1527] px-3">
              <span className="text-[#93a1c6]">⌕</span>
              <input
                placeholder="Search task"
                className="h-full w-full bg-transparent text-sm text-[#f3eee6] outline-none placeholder:text-[#7f8cad]"
              />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#222c48] bg-[#0f1527] text-sm text-[#b4bfdc] hover:text-[#f6e7c8]"
                aria-label="Messages"
              >
                ✉
              </button>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#222c48] bg-[#0f1527] text-sm text-[#b4bfdc] hover:text-[#f6e7c8]"
                aria-label="Notifications"
              >
                🔔
              </button>

              <div className="flex items-center gap-3 rounded-xl border border-[#222c48] bg-[#0f1527] px-2 py-1.5">
                <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d8b26f] bg-[#d8b26f]/15 text-sm font-bold text-[#f6e7c8]">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="pr-1 text-xs">
                  <p className="font-semibold text-[#f6e7c8]">{user.name}</p>
                  <p className="text-[#93a1c6]">{user.email}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#1a305f_0%,#1f3f8a_100%)] p-4">
              <p className="text-xs text-[#dce6ff]">Total Events</p>
              <p className="mt-2 text-3xl font-bold">{totalEvents}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#3d216a_0%,#5e3e99_100%)] p-4">
              <p className="text-xs text-[#eee4ff]">Total Bookings</p>
              <p className="mt-2 text-3xl font-bold">{totalBookings}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#1f5d4a_0%,#28846b_100%)] p-4">
              <p className="text-xs text-[#d9fff4]">Attendees</p>
              <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#6a4321_0%,#8d5f31_100%)] p-4">
              <p className="text-xs text-[#fff0dd]">Projected Revenue</p>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(projectedRevenue)}</p>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1fr]">
            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Upcoming Events</h2>
                <span className="text-xs text-[#93a1c6]">Next schedule</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#93a1c6]">
                      <th className="pb-2">Event</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Seats Left</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#e0e6f8]">
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
                          <tr key={event.id} className="border-t border-[#202944]">
                            <td className="py-2">{event.title}</td>
                            <td className="py-2 text-[#b4bfdc]">
                              {event.startAt.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-2">
                              <span className="rounded-full bg-[#d8b26f]/20 px-2 py-1 text-xs text-[#f6e7c8]">
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

            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Event Statistics</h2>
                <span className="text-xs text-[#93a1c6]">Last 6 months</span>
              </div>
              <div className="grid h-[220px] grid-cols-6 items-end gap-2 rounded-lg border border-[#202944] bg-[#0f1527] p-3">
                {monthlyStats.map((month) => {
                  const bookingsHeight = (month.bookings / maxMetric) * 100;
                  const revenueHeight = (Math.round(month.revenue / 100) / maxMetric) * 100;
                  return (
                    <div key={month.key} className="flex h-full flex-col justify-end gap-1">
                      <div
                        className="w-full rounded-sm bg-[#5679c9]"
                        style={{ height: `${Math.max(bookingsHeight, 4)}%` }}
                        title={`Bookings: ${month.bookings}`}
                      />
                      <div
                        className="w-full rounded-sm bg-[#d8b26f]"
                        style={{ height: `${Math.max(revenueHeight, 4)}%` }}
                        title={`Revenue: ${formatCurrency(month.revenue)}`}
                      />
                      <p className="pt-1 text-center text-[10px] text-[#93a1c6]">{month.label}</p>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1fr_0.85fr]">
            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Recent Bookings</h2>
              <div className="mt-3 space-y-2 text-sm">
                {recentBookings.length === 0 ? (
                  <p className="text-[#93a1c6]">No registrations yet.</p>
                ) : (
                  recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2"
                    >
                      <div>
                        <p className="font-medium text-[#e0e6f8]">{booking.user.name}</p>
                        <p className="text-xs text-[#93a1c6]">{booking.event.title}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          booking.status === RegistrationStatus.REGISTERED
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-rose-500/20 text-rose-200"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Attendee Check-in</h2>
              <div className="mt-5 flex items-center justify-center">
                <div className="grid h-40 w-40 place-items-center rounded-full border-[16px] border-[#5679c9] text-center">
                  <div>
                    <p className="text-4xl font-bold text-[#f6e7c8]">{checkedInRate}%</p>
                    <p className="text-xs text-[#93a1c6]">Checked in</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Tasks</h2>
              <ul className="mt-3 space-y-2 text-sm text-[#dce3f8]">
                <li className="rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2">
                  Send event reminders
                </li>
                <li className="rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2">
                  Update venue details
                </li>
                <li className="rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2">
                  Confirm catering order
                </li>
                <li className="rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2">
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
