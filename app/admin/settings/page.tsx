import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
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

export default async function AdminSettingsPage() {
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
              { label: "Analytics", href: "/admin/analytics", active: false },
              { label: "Messages", href: "/admin/messages", active: false },
              { label: "Settings", href: "/admin/settings", active: true },
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
              <h1 className={`${headingFont.className} text-3xl text-[#1b2441]`}>Settings</h1>
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

          <div className="relative z-10 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Profile</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  className="organizer-list-shadow rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-2 text-sm text-[#1b2441] outline-none"
                  defaultValue={user.name}
                />
                <input
                  className="organizer-list-shadow rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-2 text-sm text-[#1b2441] outline-none"
                  defaultValue={user.email}
                />
                <input
                  className="organizer-list-shadow rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-2 text-sm text-[#1b2441] outline-none"
                  placeholder="Role"
                  defaultValue="Administrator"
                />
                <input
                  className="organizer-list-shadow rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-2 text-sm text-[#1b2441] outline-none"
                  placeholder="Contact number"
                />
              </div>
              <button className="mt-4 rounded-xl bg-[#3b5dd0] px-4 py-2 text-xs font-semibold text-white shadow-sm">
                Save Profile
              </button>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Preferences</h2>
              <div className="mt-4 space-y-3 text-sm text-[#2a3659]">
                {[
                  "Email notifications for new registrations",
                  "SMS alerts for VIP check-ins",
                  "Weekly performance summary",
                ].map((item) => (
                  <label
                    key={item}
                    className="organizer-list-shadow flex items-center justify-between rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-2"
                  >
                    <span>{item}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#3b5dd0]" />
                  </label>
                ))}
              </div>
            </article>
          </div>

          <div className="relative z-10 mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Security</h2>
              <div className="mt-4 space-y-3 text-sm text-[#2a3659]">
                <div className="organizer-list-shadow rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-3">
                  <p className="font-semibold text-[#1b2441]">Two-factor authentication</p>
                  <p className="text-xs text-[#7b86a6]">Require 2FA for all admin logins.</p>
                </div>
                <div className="organizer-list-shadow rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-3">
                  <p className="font-semibold text-[#1b2441]">Session timeout</p>
                  <p className="text-xs text-[#7b86a6]">Automatically log out after 30 minutes.</p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Access</h2>
              <div className="mt-4 space-y-3 text-sm text-[#2a3659]">
                <div className="organizer-list-shadow rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-3">
                  <p className="font-semibold text-[#1b2441]">Invite new admins</p>
                  <p className="text-xs text-[#7b86a6]">Grant access to trusted team members.</p>
                </div>
                <div className="organizer-list-shadow rounded-lg border border-[#eef1f7] bg-[#f9fafe] px-3 py-3">
                  <p className="font-semibold text-[#1b2441]">Audit log</p>
                  <p className="text-xs text-[#7b86a6]">Track sensitive changes and approvals.</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
