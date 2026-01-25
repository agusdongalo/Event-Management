import { redirect } from "next/navigation";
import Link from "next/link";
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

function formatDateTime(value: Date) {
  return value.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function OrganizerMessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role !== "ORGANIZER") redirect("/");

  const recentRegistrations = await prisma.registration.findMany({
    where: {
      status: RegistrationStatus.REGISTERED,
      event: { organizerId: user.id },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      event: { select: { title: true, startAt: true } },
    },
  });

  const messages = recentRegistrations.map((registration, index) => ({
    id: registration.id,
    subject: `${registration.user.name} booked ${registration.event.title}`,
    preview: `Reservation confirmed for ${registration.event.title} on ${formatDateTime(
      registration.event.startAt
    )}.`,
    from: registration.user.email,
    time: registration.createdAt,
    unread: index < 3,
  }));

  const unreadCount = messages.filter((message) => message.unread).length;

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
            {[
              { label: "Dashboard", href: "/organizer", active: false },
              { label: "My Events", href: "/organizer/my-events", active: false },
              { label: "Bookings", href: "/organizer/bookings", active: false },
              { label: "Attendees", href: "/organizer/attendees", active: false },
              { label: "Messages", href: "/organizer/messages", active: true },
              { label: "My Profile", href: "#", active: false },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-lg px-3 py-2 ${
                  item.active
                    ? "bg-[#d8b26f]/20 text-[#f6e7c8]"
                    : "text-[#b4bfdc] hover:bg-[#1a253d] hover:text-[#f6e7c8]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

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
                placeholder="Search messages..."
                className="h-full w-full bg-transparent text-sm text-[#f3eee6] outline-none placeholder:text-[#7f8cad]"
              />
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/organizer"
                className="rounded-lg border border-[#222c48] bg-[#0f1527] px-4 py-2 text-xs font-semibold text-[#dbe5ff] hover:text-[#f6e7c8]"
              >
                Back to Dashboard
              </Link>
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
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#2c2d75_0%,#3d4cb5_100%)] p-4">
              <p className="text-xs text-[#dce2ff]">Total Messages</p>
              <p className="mt-2 text-3xl font-bold">{messages.length}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#1f5d4a_0%,#28846b_100%)] p-4">
              <p className="text-xs text-[#d9fff4]">Unread</p>
              <p className="mt-2 text-3xl font-bold">{unreadCount}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#21506a_0%,#2b7b9d_100%)] p-4">
              <p className="text-xs text-[#ddf4ff]">Auto Alerts</p>
              <p className="mt-2 text-3xl font-bold">{messages.length}</p>
            </article>
            <article className="rounded-xl border border-[#2a3248] bg-[linear-gradient(135deg,#6a4321_0%,#8d5f31_100%)] p-4">
              <p className="text-xs text-[#fff0dd]">Response SLA</p>
              <p className="mt-2 text-3xl font-bold">2h</p>
            </article>
          </div>

          <article className="mt-4 rounded-xl border border-[#2a3248] bg-[#12192a] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Inbox</h2>
              <span className="text-xs text-[#93a1c6]">{messages.length} total</span>
            </div>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="rounded-lg border border-[#202944] bg-[#0f1527] p-4 text-sm text-[#93a1c6]">
                  No messages yet.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#202944] bg-[#0f1527] px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            message.unread ? "bg-emerald-400" : "bg-slate-500"
                          }`}
                        />
                        <p className="truncate font-semibold text-[#e0e6f8]">{message.subject}</p>
                      </div>
                      <p className="mt-1 truncate text-xs text-[#93a1c6]">{message.preview}</p>
                      <p className="mt-2 text-[11px] text-[#62719a]">{message.from}</p>
                    </div>
                    <div className="text-xs text-[#93a1c6]">{formatDateTime(message.time)}</div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
