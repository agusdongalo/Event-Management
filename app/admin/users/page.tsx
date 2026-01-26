import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { prisma } from "@/lib/prisma";
import UsersToolbar from "./users-toolbar";

export const dynamic = "force-dynamic";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

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
              { label: "Users", href: "/admin/users", active: true },
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
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b7593]">Admin</p>
              <h1 className={`${headingFont.className} text-3xl text-[#1b2441]`}>Users</h1>
            </div>
            <div className="flex items-start gap-3">
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
              <div className="flex flex-col items-end gap-2">
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
            </div>
          </header>

          <UsersToolbar />

          <div className="organizer-top-shadow relative z-10 rounded-2xl bg-white p-4 shadow-sm">
            <div className="grid gap-2 text-sm font-semibold text-[#4a5b87] sm:grid-cols-[1.4fr_1.6fr_0.7fr_0.8fr]">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Created</span>
            </div>
            <div className="mt-3 space-y-2">
              {users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e0e5f2] px-4 py-6 text-center text-sm text-[#6b7593]">
                  No users found.
                </div>
              ) : (
                users.map((account) => (
                  <div
                    key={account.id}
                    className="organizer-list-shadow grid items-center gap-2 rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-3 text-sm text-[#243054] sm:grid-cols-[1.4fr_1.6fr_0.7fr_0.8fr]"
                  >
                    <div>
                      <p className="font-medium">{account.name}</p>
                    </div>
                    <span className="text-[#6b7593]">{account.email}</span>
                    <span
                      className={`w-fit rounded-full px-2 py-1 text-xs organizer-badge ${
                        account.role === "ADMIN"
                          ? "bg-rose-100 text-rose-700"
                          : account.role === "ORGANIZER"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {account.role}
                    </span>
                    <span className="text-[#6b7593]">{formatDate(account.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
