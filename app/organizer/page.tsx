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

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

export default async function OrganizerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role !== "ORGANIZER") redirect("/");

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [totalBookings, attendeeList, upcomingEvents, recentBookings, chartRegistrations] =
    await Promise.all([
      prisma.registration.count({
        where: {
          status: RegistrationStatus.REGISTERED,
          event: { organizerId: user.id },
        },
      }),
      prisma.registration.findMany({
        where: {
          status: RegistrationStatus.REGISTERED,
          event: { organizerId: user.id },
        },
        distinct: ["userId"],
        select: { userId: true },
      }),
      prisma.event.findMany({
        where: { organizerId: user.id, startAt: { gte: now } },
        orderBy: { startAt: "asc" },
        take: 5,
        select: {
          id: true,
          title: true,
          startAt: true,
          _count: { select: { registrations: true } },
        },
      }),
      prisma.registration.findMany({
        where: { event: { organizerId: user.id } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          user: { select: { name: true } },
          event: { select: { title: true } },
        },
      }),
      prisma.registration.findMany({
        where: {
          createdAt: { gte: sixMonthsAgo },
          event: { organizerId: user.id },
        },
        select: { createdAt: true },
      }),
    ]);

  const totalAttendees = attendeeList.length;
  const revenue = totalBookings * ESTIMATED_TICKET_PRICE;

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
  for (const registration of chartRegistrations) {
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
              <p className="text-xs text-[#93a1c6]">Event Manager</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2 text-sm">
            {["Dashboard", "My Events", "Bookings", "Attendees", "Messages", "My Profile"].map(
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

          <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#243255] bg-[#0f1527] px-3 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-[#d8b26f] bg-[#d8b26f]/15 text-xs font-semibold text-[#f6e7c8]">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 text-xs">
              <p className="truncate font-semibold text-[#f6e7c8]">{user.name}</p>
              <p className="truncate text-[#93a1c6]">Event Manager</p>
            </div>
          </div>

          <LogoutButton
            containerClassName="mt-4 flex flex-col gap-1"
            className="w-fit rounded-md border border-[#f0f3ff] px-3 py-2 text-xs font-semibold text-[#f8f9ff] transition hover:bg-white/10 disabled:opacity-60"
            errorClassName="text-[11px] text-rose-300"
            redirectTo="/"
          />
        </aside>

        <section className="p-4 md:p-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#2a3248] bg-[#12192a] p-3 md:p-4">
            <div className="flex h-12 w-full max-w-xl items-center gap-2 rounded-xl border border-[#222c48] bg-[#0f1527] px-3">
              <span className="text-[#93a1c6]">S</span>
              <input
                placeholder="Search..."
                className="h-full w-full bg-transparent text-sm text-[#f3eee6] outline-none placeholder:text-[#7f8cad]"
              />
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#222c48] bg-[#0f1527] text-sm text-[#b4bfdc] hover:text-[#f6e7c8]"
                aria-label="Notifications"
              >
                N
              </button>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#222c48] bg-[#0f1527] text-sm text-[#b4bfdc] hover:text-[#f6e7c8]"
                aria-label="Messages"
              >
                M
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
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#3d216a_0%,#5e3e99_100%)] p-4">
              <p className="text-xs text-[#eee4ff]">Total Bookings</p>
              <p className="mt-2 text-3xl font-bold">{totalBookings}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#1f5d4a_0%,#28846b_100%)] p-4">
              <p className="text-xs text-[#d9fff4]">Attendees</p>
              <p className="mt-2 text-3xl font-bold">{totalAttendees}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#1f6f65_0%,#3f9a8e_100%)] p-4">
              <p className="text-xs text-[#dffaf6]">Revenue</p>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(revenue)}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#6a4321_0%,#8d5f31_100%)] p-4">
              <p className="text-xs text-[#fff0dd]">Reports</p>
              <p className="mt-2 text-3xl font-bold">{formatCompactCurrency(revenue)}</p>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>
                  My Upcoming Events
                </h2>
                <span className="text-xs text-[#93a1c6]">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#93a1c6]">
                      <th className="pb-2">Event Name</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Status</th>
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
                      upcomingEvents.map((event) => (
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
                            <span className="rounded-full bg-violet-500/20 px-2 py-1 text-xs text-violet-200">
                              Managing
                            </span>{" "}
                            <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-200">
                              Upcoming
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Tasks & Reminders</h2>
              </div>
              <ul className="space-y-2 text-sm text-[#dce3f8]">
                <li className="rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2">
                  Update Tech Conference schedule
                </li>
                <li className="rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2">
                  Send reminder email to attendees
                </li>
                <li className="rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2">
                  Confirm caterer for weekend event
                </li>
                <li className="rounded-lg border border-[#202944] bg-[#0f1527] px-3 py-2">
                  Review AV needs for meetup
                </li>
              </ul>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Recent Bookings</h2>
                <span className="text-xs text-[#93a1c6]">View All</span>
              </div>
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
                      <span className="rounded-full bg-[#5679c9]/20 px-2 py-1 text-xs text-[#c8d7ff]">
                        Ticket
                      </span>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Event Overview</h2>
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
                        className="w-full rounded-sm bg-[#3baa78]"
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
        </section>
      </div>
    </main>
  );
}
