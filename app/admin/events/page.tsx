import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggleButton } from "@/components/theme-toggle";
import AdminEventsClient from "./admin-events-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const fallbackEvents = [
  {
    title: "Executive Summit",
    date: "Mar 08, 2026",
    venue: "Velvet Hall, NY",
    status: "Live",
    seats: 18,
  },
  {
    title: "Founder Dinner",
    date: "Mar 15, 2026",
    venue: "Maison Rive, LA",
    status: "Upcoming",
    seats: 6,
  },
  {
    title: "Luxury Brand Gala",
    date: "Mar 21, 2026",
    venue: "Noir Atelier",
    status: "Upcoming",
    seats: 42,
  },
  {
    title: "Private Art Soiree",
    date: "Mar 28, 2026",
    venue: "Crown & Co Gallery",
    status: "Draft",
    seats: 120,
  },
];

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const formatStatus = (status: string) => {
  switch (status) {
    case "LIVE":
      return "Live";
    case "DRAFT":
      return "Draft";
    default:
      return "Upcoming";
  }
};

export default async function AdminEventsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  const organizers = await prisma.user.findMany({
    where: { role: "ORGANIZER" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
  const validOrganizers = organizers.filter((organizer) => organizer.id.trim().length > 0);

  const dbEvents = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
  });
  const events =
    dbEvents.length > 0
      ? dbEvents.map((event) => ({
          title: event.title,
          date: formatDate(event.startAt),
          venue: event.venue,
          status: formatStatus(event.status),
          seats: event.capacity,
        }))
      : fallbackEvents;

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
              { label: "Events", href: "/admin/events", active: true },
              { label: "Registrations", href: "/admin/registrations", active: false },
              { label: "Attendees", href: "/admin/attendees", active: false },
              { label: "Users", href: "/admin/users", active: false },
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
              <h1 className={`${headingFont.className} text-3xl text-[#1b2441]`}>Events</h1>
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

          <AdminEventsClient initialEvents={events} organizers={validOrganizers} />

        </section>
      </div>
    </main>
  );
}
