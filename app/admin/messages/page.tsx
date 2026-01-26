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

const conversations = [
  {
    name: "Maison Rive",
    lastMessage: "VIP confirmations are ready to approve.",
    time: "2m ago",
    unread: 2,
  },
  {
    name: "Velvet Hall",
    lastMessage: "Updated seating plan attached.",
    time: "1h ago",
    unread: 0,
  },
  {
    name: "Aria Group",
    lastMessage: "Can we increase the guest cap?",
    time: "3h ago",
    unread: 1,
  },
  {
    name: "Luxe District",
    lastMessage: "Need a final headcount by Friday.",
    time: "Yesterday",
    unread: 0,
  },
];

const messages = [
  { from: "Maison Rive", text: "VIP confirmations are ready to approve.", time: "10:22 AM" },
  { from: "Admin", text: "Great. I will review and send approvals.", time: "10:24 AM" },
  { from: "Maison Rive", text: "Thank you. We also updated seating details.", time: "10:25 AM" },
];

export default async function AdminMessagesPage() {
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
              { label: "Analytics", href: "/admin/analytics", active: false },
              { label: "Messages", href: "/admin/messages", active: true },
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
              <h1 className={`${headingFont.className} text-3xl text-[#1b2441]`}>Messages</h1>
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

          <div className="relative z-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Inbox</h2>
                <span className="text-xs text-[#8b93ad]">4 conversations</span>
              </div>
              <div className="space-y-3">
                {conversations.map((chat) => (
                  <div
                    key={chat.name}
                    className="organizer-list-shadow flex items-center justify-between rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[#243054]">{chat.name}</p>
                      <p className="text-xs text-[#7b86a6]">{chat.lastMessage}</p>
                    </div>
                    <div className="text-right text-xs text-[#7b86a6]">
                      <p>{chat.time}</p>
                      {chat.unread ? (
                        <span className="organizer-badge mt-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#3b5dd0] text-[10px] text-white">
                          {chat.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Conversation</h2>
                <button className="organizer-badge rounded-full bg-[#e8f1ff] px-3 py-1 text-xs font-semibold text-[#3b5dd0]">
                  Mark as resolved
                </button>
              </div>
              <div className="space-y-3">
                {messages.map((message, index) => {
                  const isAdmin = message.from === "Admin";
                  return (
                    <div
                      key={`${message.from}-${index}`}
                      className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                          isAdmin
                            ? "bg-[#3b5dd0] text-white organizer-badge"
                            : "organizer-chat-bubble bg-[#f2f4ff] text-[#243054]"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="mt-2 text-[10px] opacity-70">{message.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-2">
                <input
                  placeholder="Write a reply..."
                  className="w-full bg-transparent text-sm text-[#1a1f35] outline-none placeholder:text-[#9aa2b6]"
                />
                <button className="organizer-badge rounded-full bg-[#3b5dd0] px-4 py-2 text-xs font-semibold text-white">
                  Send
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
