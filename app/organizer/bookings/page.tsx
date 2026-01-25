import { redirect } from "next/navigation";
import Link from "next/link";
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

const statCards = [
  {
    title: "Total Bookings",
    value: "128",
    tone: "from-[#6a5af9] via-[#7b62ff] to-[#8a74ff]",
  },
  {
    title: "Registered",
    value: "120",
    tone: "from-[#2f7a6b] via-[#2f8c7a] to-[#36a18c]",
  },
  {
    title: "Cancelled",
    value: "8",
    tone: "from-[#d65b6a] via-[#c84d5c] to-[#b74150]",
  },
  {
    title: "Unique Attendees",
    value: "94",
    tone: "from-[#2b6f96] via-[#2c7aa6] to-[#2f86b5]",
  },
];

const bookings = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    event: "Tech Conference 2024",
    eventDate: "May 12, 2024",
    status: "Registered",
    bookedOn: "Apr 02, 2024",
    venue: "Downtown Hall",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    event: "Marketing Workshop",
    eventDate: "Jun 05, 2024",
    status: "Registered",
    bookedOn: "Apr 10, 2024",
    venue: "Rooftop Lab",
  },
  {
    name: "David Brown",
    email: "david.brown@email.com",
    event: "Music Fest",
    eventDate: "May 25, 2024",
    status: "Cancelled",
    bookedOn: "Apr 18, 2024",
    venue: "Harbor Arena",
  },
];

export default async function OrganizerBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role !== "ORGANIZER") redirect("/");

  return (
    <main className={`${bodyFont.className} min-h-screen organizer-theme text-[#0d1021]`}>
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="bg-[linear-gradient(180deg,#2b3f66_0%,#1b2a4a_45%,#13223b_100%)] organizer-nav px-5 py-6 text-white">
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
              { label: "Dashboard", href: "/organizer", active: false },
              { label: "My Events", href: "/organizer/my-events", active: false },
              { label: "Bookings", href: "/organizer/bookings", active: true },
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

        <section className="organizer-content p-5 md:p-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex h-11 w-full max-w-xl items-center gap-2 rounded-xl border border-transparent bg-white px-3 shadow-sm">
              <span className="text-[#8b93ad]">S</span>
              <input
                placeholder="Search bookings..."
                className="h-full w-full bg-transparent text-sm text-[#1a1f35] outline-none placeholder:text-[#9aa2b6]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/organizer"
                className="rounded-lg border border-white bg-white px-4 py-2 text-xs font-semibold text-[#394569] shadow-sm"
              >
                Back to Dashboard
              </Link>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white bg-white text-[#51607f] shadow-sm"
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
              <ThemeToggleButton />
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

          <article className="mt-4 rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className={`${headingFont.className} text-2xl text-[#1b2441]`}>Bookings</h2>
              <span className="text-xs text-[#5a6ca3]">{bookings.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[#8b93ad]">
                    <th className="pb-2">Attendee</th>
                    <th className="pb-2">Event</th>
                    <th className="pb-2">Event Date</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Booked On</th>
                    <th className="pb-2">Venue</th>
                  </tr>
                </thead>
                <tbody className="text-[#243054]">
                  {bookings.map((booking) => (
                    <tr key={booking.email} className="border-t border-[#eef1f7]">
                      <td className="py-3">
                        <div className="font-medium">{booking.name}</div>
                        <div className="text-xs text-[#7b86a6]">{booking.email}</div>
                      </td>
                      <td className="py-3 font-medium">{booking.event}</td>
                      <td className="py-3 text-[#6b7593]">{booking.eventDate}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            booking.status === "Registered"
                              ? "bg-[#e7f7ef] text-[#2f8a62]"
                              : "bg-[#fde9eb] text-[#b74150]"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 text-[#6b7593]">{booking.bookedOn}</td>
                      <td className="py-3 text-[#6b7593]">{booking.venue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}









