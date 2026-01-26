import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { SegmentedToggle } from "@/components/segmented-toggle";
import { AdminSearch } from "@/components/admin-search";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const stats = [
  { label: "Total Events", value: "12", tone: "from-[#6a5af9] via-[#7b62ff] to-[#8a74ff]" },
  { label: "Registrations", value: "428", tone: "from-[#6b3b94] via-[#7d4db0] to-[#8d5fc4]" },
  { label: "Attendees", value: "392", tone: "from-[#2f7a6b] via-[#2f8c7a] to-[#36a18c]" },
  { label: "Projected Revenue", value: "$28,900", tone: "from-[#f3a652] via-[#f2a142] to-[#f19a2f]" },
];

const upcomingEvents = [
  { name: "Executive Summit", date: "Mar 08, 2026", seatsLeft: 18 },
  { name: "Founder Dinner", date: "Mar 15, 2026", seatsLeft: 6 },
  { name: "Luxury Brand Gala", date: "Mar 21, 2026", seatsLeft: 42 },
];

const registrations = [
  { name: "Amelia Grant", event: "Executive Summit", status: "Verified" },
  { name: "Noah Sinclair", event: "Founder Dinner", status: "Pending" },
  { name: "Lena Hart", event: "Luxury Brand Gala", status: "Verified" },
  { name: "Marcus Cole", event: "Luxury Brand Gala", status: "Waitlist" },
];

const checkins = [
  { name: "Aria Summers", event: "Executive Summit", status: "Checked In" },
  { name: "Daniel Reed", event: "Founder Dinner", status: "Arriving" },
  { name: "Sofia Lin", event: "Luxury Brand Gala", status: "VIP" },
];

const tasks = [
  "Approve Executive Summit registrations",
  "Finalize VIP guest list",
  "Assign check-in staff",
  "Review venue security plan",
];

const overviewMonths = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
const bookingsTrend = [12, 24, 18, 30, 28, 26];
const revenueTrend = [8, 20, 16, 26, 30, 24];

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <main className={`${bodyFont.className} min-h-screen w-full organizer-theme text-[#0d1021]`}>
      <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr]">
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
              { label: "Dashboard", href: "/admin", active: true },
              { label: "Events", href: "/admin/events", active: false },
              { label: "Registrations", href: "/admin/registrations", active: false },
              { label: "Attendees", href: "/admin/attendees", active: false },
              { label: "Analytics", href: "/admin/analytics", active: false },
              { label: "Messages", href: "/admin/messages", active: false },
              { label: "Settings", href: "/admin/settings", active: false },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                  item.active
                    ? "bg-[#32508f] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <LogoutButton
            containerClassName="mt-6 flex flex-col gap-1"
            className="w-fit rounded-md border border-white/60 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
            errorClassName="text-[11px] text-rose-200"
            redirectTo="/"
          />
        </aside>

        <section className="organizer-content p-5 md:p-7">
          <header className="relative z-20 mb-6 flex flex-wrap items-center justify-between gap-3">
            <AdminSearch />

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

          <div className="relative z-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className={`organizer-stat-card rounded-xl bg-gradient-to-r ${stat.tone} p-4 text-white shadow-md`}
              >
                <p className="text-xs text-white/80">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Upcoming Events</h2>
                <button className="rounded-full bg-[#e8f1ff] px-3 py-1 text-xs font-semibold text-[#3b5dd0]">
                  + Add Event
                </button>
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
                    {upcomingEvents.map((event) => (
                      <tr key={event.name} className="border-t border-[#eef1f7]">
                        <td className="py-2">{event.name}</td>
                        <td className="py-2 text-[#6b7593]">{event.date}</td>
                        <td className="py-2">
                          <span className="rounded-full bg-[#ede9ff] px-2 py-1 text-xs text-[#5c53d6] organizer-badge">
                            {event.seatsLeft}
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
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Event Statistics</h2>
                <SegmentedToggle options={["Year", "Month", "Week", "Day"]} initialIndex={0} />
              </div>
              <div className="rounded-xl border border-[#eef1f7] bg-[#f8f9fd] p-3">
                <svg viewBox="0 0 600 220" className="h-[220px] w-full">
                  <defs>
                    <linearGradient id="statPrimary" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6c86ff" />
                      <stop offset="100%" stopColor="#4464e6" />
                    </linearGradient>
                    <linearGradient id="statFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6c86ff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6c86ff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="statSecondary" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#c6d2ff" />
                      <stop offset="100%" stopColor="#97a9e8" />
                    </linearGradient>
                  </defs>

                  <g stroke="#e7ebf5" strokeWidth="1">
                    {[25, 65, 105, 145, 185].map((y) => (
                      <line key={y} x1="0" y1={y} x2="600" y2={y} />
                    ))}
                  </g>

                  <path
                    d="M0 150 C40 120 70 110 100 118 C140 128 160 150 200 132 C240 114 270 102 300 110 C340 122 360 138 400 120 C440 102 470 84 500 92 C540 100 570 94 600 88"
                    fill="none"
                    stroke="url(#statSecondary)"
                    strokeWidth="2"
                  />

                  <path
                    d="M0 170 C40 130 70 110 100 116 C140 124 160 148 200 126 C240 104 270 92 300 104 C340 120 360 136 400 116 C440 96 470 72 500 82 C540 92 570 80 600 74"
                    fill="none"
                    stroke="url(#statPrimary)"
                    strokeWidth="3"
                  />
                  <path
                    d="M0 170 C40 130 70 110 100 116 C140 124 160 148 200 126 C240 104 270 92 300 104 C340 120 360 136 400 116 C440 96 470 72 500 82 C540 92 570 80 600 74 L600 220 L0 220 Z"
                    fill="url(#statFill)"
                  />

                  <g fill="#4f6bff">
                    {[100, 200, 300, 400, 500].map((x, index) => (
                      <circle key={x} cx={x} cy={[116, 126, 104, 116, 82][index]} r="3.5" />
                    ))}
                  </g>

                  <g fill="#7b86a6" fontSize="10">
                    {overviewMonths.map((label, index) => (
                      <text key={label} x={index * 100} y={212}>
                        {label}
                      </text>
                    ))}
                  </g>
                </svg>
                <div className="mt-2 flex items-center justify-between text-[10px] text-[#7b86a6]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#4f6bff]" />
                    Bookings
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#97a9e8]" />
                    Revenue
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1fr_0.85fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Registrations</h2>
              <div className="mt-3 space-y-2 text-sm">
                {registrations.map((booking) => (
                  <div
                    key={booking.name}
                    className="flex items-center justify-between rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-[#243054]">{booking.name}</p>
                      <p className="text-xs text-[#7b86a6]">{booking.event}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs organizer-badge ${
                        booking.status === "Verified"
                          ? "bg-emerald-100 text-emerald-700"
                          : booking.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Attendee Check-in</h2>
              <div className="mt-3 space-y-2 text-sm">
                {checkins.map((checkin) => (
                  <div
                    key={checkin.name}
                    className="flex items-center justify-between rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-[#243054]">{checkin.name}</p>
                      <p className="text-xs text-[#7b86a6]">{checkin.event}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs organizer-badge ${
                        checkin.status === "Checked In"
                          ? "bg-emerald-100 text-emerald-700"
                          : checkin.status === "VIP"
                            ? "bg-[#ede9ff] text-[#5c53d6]"
                            : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {checkin.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Admin Tasks</h2>
              <ul className="mt-3 space-y-2 text-sm text-[#2a3659]">
                {tasks.map((task) => (
                  <li
                    key={task}
                    className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2"
                  >
                    {task}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
