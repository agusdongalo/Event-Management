import { redirect } from "next/navigation";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const statCards = [
  {
    title: "Total Bookings",
    value: "2,875",
    tone: "from-[#6a5af9] via-[#7b62ff] to-[#8a74ff]",
  },
  {
    title: "Attendees",
    value: "5,420",
    tone: "from-[#2f7a6b] via-[#2f8c7a] to-[#36a18c]",
  },
  {
    title: "Revenue",
    value: "$86,210",
    tone: "from-[#3b8c7c] via-[#3fa18d] to-[#43b59d]",
  },
  {
    title: "Reports",
    value: "$55.19K",
    tone: "from-[#f3a652] via-[#f2a142] to-[#f19a2f]",
  },
];

const upcomingEvents = [
  {
    name: "Tech Conference 2024",
    date: "May 12, 2024",
    status: ["Managing", "Upcoming"],
  },
  {
    name: "Marketing Workshop",
    date: "Jun 05, 2024",
    status: ["Managing", "Upcoming"],
  },
  {
    name: "Music Fest",
    date: "May 25, 2024",
    status: ["Managing", "Upcoming"],
  },
  {
    name: "Corporate Meetup",
    date: "Jun 10, 2024",
    status: ["Managing", "Upcoming"],
  },
];

const tasks = [
  "Update Tech Conference schedule",
  "Send reminder email to attendees",
  "Confirm caterer for Music Fest",
  "Review AV needs for meetup",
];

const recentBookings = [
  { name: "John Smith", event: "Tech Conference 2024", tickets: "2 Tickets" },
  { name: "Sarah Johnson", event: "Marketing Workshop", tickets: "4 Tickets" },
  { name: "David Brown", event: "Music Fest", tickets: "1 Ticket" },
];

const overviewMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const bookingsTrend = [12, 28, 22, 30, 35, 31];
const revenueTrend = [8, 22, 18, 26, 32, 38];

export default async function OrganizerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role !== "ORGANIZER") redirect("/");

  return (
    <main className={`${bodyFont.className} min-h-screen bg-[#f4f5fb] text-[#0d1021]`}>
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="bg-[linear-gradient(180deg,#2b3f66_0%,#1b2a4a_45%,#13223b_100%)] px-5 py-6 text-white">
          <div className="flex items-center gap-3 pb-5">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xs font-semibold uppercase tracking-[0.28em]">
              SE
            </div>
            <div>
              <p className={`${headingFont.className} text-2xl`}>Dashboard</p>
              <p className="text-xs text-white/70">Event Manager</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2 text-sm">
            {[
              { label: "Dashboard", href: "/organizer", active: true },
              { label: "My Events", href: "/organizer/my-events", active: false },
              { label: "Bookings", href: "/organizer/bookings", active: false },
              { label: "Attendees", href: "/organizer/attendees", active: false },
              { label: "Messages", href: "/organizer/messages", active: false },
              { label: "My Profile", href: "/organizer/profile", active: false },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                  item.active
                    ? "bg-[#32508f] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {item.label === "Messages" ? (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-semibold">
                    2
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-xs font-semibold">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-white/70">Event Manager</p>
            </div>
          </div>

          <LogoutButton
            containerClassName="mt-4 flex flex-col gap-1"
            className="w-fit rounded-md border border-white/60 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
            errorClassName="text-[11px] text-rose-200"
            redirectTo="/"
          />
        </aside>

        <section className="p-5 md:p-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex h-11 w-full max-w-xl items-center gap-2 rounded-xl border border-transparent bg-white px-3 shadow-sm">
              <span className="text-[#8b93ad]">??</span>
              <input
                placeholder="Search..."
                className="h-full w-full bg-transparent text-sm text-[#1a1f35] outline-none placeholder:text-[#9aa2b6]"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white bg-white text-sm text-[#51607f] shadow-sm"
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
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white bg-white text-sm text-[#51607f] shadow-sm"
                aria-label="Theme"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.5A9 9 0 1111.5 3a7 7 0 109.5 9.5z" />
                  <text
                    x="11.5"
                    y="14"
                    textAnchor="middle"
                    fontSize="8"
                    fill="currentColor"
                    stroke="none"
                  >
                    C
                  </text>
                </svg>
              </button>
              <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 shadow-sm">
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

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <article
                key={card.title}
                className={`rounded-xl bg-gradient-to-r ${card.tone} p-4 text-white shadow-md`}
              >
                <p className="text-xs text-white/80">{card.title}</p>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>My Upcoming Events</h2>
                <Link href="/organizer/my-events" className="text-xs text-[#5a6ca3]">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[#8b93ad]">
                      <th className="pb-2">Event Name</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#243054]">
                    {upcomingEvents.map((event) => (
                      <tr key={event.name} className="border-t border-[#eef1f7]">
                        <td className="py-2 font-medium">{event.name}</td>
                        <td className="py-2 text-[#6b7593]">{event.date}</td>
                        <td className="py-2">
                          <span className="rounded-full bg-[#ede9ff] px-2 py-1 text-xs text-[#5c53d6]">
                            {event.status[0]}
                          </span>
                          <span className="ml-2 rounded-full bg-[#e7f7ef] px-2 py-1 text-xs text-[#2f8a62]">
                            {event.status[1]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Tasks & Reminders</h2>
              </div>
              <ul className="space-y-2 text-sm text-[#2a3659]">
                {tasks.map((task) => (
                  <li key={task} className="flex items-center gap-2 rounded-lg border border-[#eef1f7] px-3 py-2">
                    <input type="checkbox" className="h-4 w-4 accent-[#3b5dd0]" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-3 w-full rounded-lg bg-[#3b5dd0] px-3 py-2 text-xs font-semibold text-white"
              >
                + Add Task
              </button>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Recent Bookings</h2>
                <Link href="/organizer/bookings" className="text-xs text-[#5a6ca3]">
                  View All
                </Link>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.name}
                    className="flex items-center justify-between rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-[#243054]">{booking.name}</p>
                      <p className="text-xs text-[#7b86a6]">{booking.event}</p>
                    </div>
                    <span className="rounded-full bg-[#e8f1ff] px-2 py-1 text-xs text-[#3b5dd0]">
                      {booking.tickets}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Event Overview</h2>
              </div>
              <div className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] p-3">
                <div className="mb-3 flex items-center justify-between text-xs text-[#7b86a6]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#3b5dd0]" />
                    Bookings
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#2f8a62]" />
                    Revenue
                  </div>
                </div>
                <div className="grid grid-cols-6 items-end gap-2">
                  {overviewMonths.map((month, index) => (
                    <div key={month} className="flex flex-col items-center gap-2">
                      <div className="flex h-28 w-full items-end gap-1">
                        <div
                          className="w-1/2 rounded-sm bg-[#3b5dd0]"
                          style={{ height: `${bookingsTrend[index]}%` }}
                        />
                        <div
                          className="w-1/2 rounded-sm bg-[#2f8a62]"
                          style={{ height: `${revenueTrend[index]}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#7b86a6]">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

