import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { SegmentedToggle } from "@/components/segmented-toggle";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const kpis = [
  { label: "Total Revenue", value: "$128,400", change: "+12.4%" },
  { label: "Avg. Ticket Value", value: "$240", change: "+4.1%" },
  { label: "Attendance Rate", value: "92%", change: "+3.2%" },
  { label: "Refund Rate", value: "1.8%", change: "-0.6%" },
];

const channels = [
  { label: "Direct Invite", value: "46%" },
  { label: "Partner Lists", value: "28%" },
  { label: "Organic", value: "18%" },
  { label: "Referral", value: "8%" },
];

const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
const revenueTrend = [18, 24, 20, 32, 28, 30];
const attendanceTrend = [70, 76, 74, 82, 88, 92];

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

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
              { label: "Dashboard", href: "/admin", active: false },
              { label: "Events", href: "/admin/events", active: false },
              { label: "Registrations", href: "/admin/registrations", active: false },
              { label: "Attendees", href: "/admin/attendees", active: false },
              { label: "Users", href: "/admin/users", active: false },
              { label: "Analytics", href: "/admin/analytics", active: true },
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
          <header className="relative z-0 mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b7593]">Admin</p>
              <h1 className={`${headingFont.className} text-3xl text-[#1b2441]`}>Analytics</h1>
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

          <div className="relative z-0 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <article key={kpi.label} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7b86a6]">{kpi.label}</p>
                <p className={`${headingFont.className} mt-3 text-3xl text-[#1b2441]`}>{kpi.value}</p>
                <p className="mt-2 text-xs text-emerald-600">{kpi.change} vs last month</p>
              </article>
            ))}
          </div>

          <div className="relative z-10 mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Revenue Trend</h2>
                <SegmentedToggle options={["Year", "Month", "Week", "Day"]} initialIndex={1} />
              </div>
              <div className="rounded-xl border border-[#eef1f7] bg-[#f8f9fd] p-3">
                <svg viewBox="0 0 600 220" className="h-[220px] w-full">
                  <defs>
                    <linearGradient id="revLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6c86ff" />
                      <stop offset="100%" stopColor="#4464e6" />
                    </linearGradient>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6c86ff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6c86ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g stroke="#e7ebf5" strokeWidth="1">
                    {[25, 65, 105, 145, 185].map((y) => (
                      <line key={y} x1="0" y1={y} x2="600" y2={y} />
                    ))}
                  </g>
                  <path
                    d="M0 170 C40 130 70 110 100 116 C140 124 160 148 200 126 C240 104 270 92 300 104 C340 120 360 136 400 116 C440 96 470 72 500 82 C540 92 570 80 600 74"
                    fill="none"
                    stroke="url(#revLine)"
                    strokeWidth="3"
                  />
                  <path
                    d="M0 170 C40 130 70 110 100 116 C140 124 160 148 200 126 C240 104 270 92 300 104 C340 120 360 136 400 116 C440 96 470 72 500 82 C540 92 570 80 600 74 L600 220 L0 220 Z"
                    fill="url(#revFill)"
                  />
                  <g fill="#4f6bff">
                    {[100, 200, 300, 400, 500].map((x, index) => (
                      <circle key={x} cx={x} cy={[116, 126, 104, 116, 82][index]} r="3.5" />
                    ))}
                  </g>
                  <g fill="#7b86a6" fontSize="10">
                    {months.map((label, index) => (
                      <text key={label} x={index * 100} y={212}>
                        {label}
                      </text>
                    ))}
                  </g>
                </svg>
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Attendance Rate</h2>
                <SegmentedToggle options={["Year", "Month", "Week", "Day"]} initialIndex={1} />
              </div>
              <div className="rounded-xl border border-[#eef1f7] bg-[#f8f9fd] p-3">
                <svg viewBox="0 0 600 220" className="h-[220px] w-full">
                  <defs>
                    <linearGradient id="attLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34b37f" />
                      <stop offset="100%" stopColor="#2a8b62" />
                    </linearGradient>
                    <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34b37f" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#34b37f" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g stroke="#e7ebf5" strokeWidth="1">
                    {[25, 65, 105, 145, 185].map((y) => (
                      <line key={y} x1="0" y1={y} x2="600" y2={y} />
                    ))}
                  </g>
                  <path
                    d="M0 160 C40 145 70 135 100 140 C140 148 160 160 200 150 C240 138 270 126 300 132 C340 142 360 150 400 140 C440 130 470 120 500 124 C540 128 570 122 600 120"
                    fill="none"
                    stroke="url(#attLine)"
                    strokeWidth="3"
                  />
                  <path
                    d="M0 160 C40 145 70 135 100 140 C140 148 160 160 200 150 C240 138 270 126 300 132 C340 142 360 150 400 140 C440 130 470 120 500 124 C540 128 570 122 600 120 L600 220 L0 220 Z"
                    fill="url(#attFill)"
                  />
                  <g fill="#2a8b62">
                    {[100, 200, 300, 400, 500].map((x, index) => (
                      <circle key={x} cx={x} cy={[140, 150, 132, 140, 124][index]} r="3.5" />
                    ))}
                  </g>
                  <g fill="#7b86a6" fontSize="10">
                    {months.map((label, index) => (
                      <text key={label} x={index * 100} y={212}>
                        {label}
                      </text>
                    ))}
                  </g>
                </svg>
              </div>
            </article>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Channel Mix</h2>
              <div className="mt-4 space-y-3">
                {channels.map((channel) => (
                  <div key={channel.label}>
                    <div className="flex items-center justify-between text-xs text-[#7b86a6]">
                      <span>{channel.label}</span>
                      <span>{channel.value}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#eef1f7]">
                      <div
                        className="h-2 rounded-full bg-[#3b5dd0]"
                        style={{ width: channel.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Insights</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#2a3659]">
                <li className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2">
                  VIP attendance increased by 18% this month.
                </li>
                <li className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2">
                  The Executive Summit reached 92% capacity in 48 hours.
                </li>
                <li className="rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2">
                  Founder Dinner invitations convert at 64%.
                </li>
              </ul>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
