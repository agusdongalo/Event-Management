import Link from "next/link";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import EventCardLink from "./event-card-link";

export const dynamic = "force-dynamic";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const fallbackFeaturedEvents = [
  {
    title: "Executive Summit",
    date: "Mar 08, 2026",
    venue: "Velvet Hall, NY",
    status: "Invite Only",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Founder Dinner",
    date: "Mar 15, 2026",
    venue: "Maison Rive, LA",
    status: "Limited Seats",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
];

const fallbackEventCards = [
  {
    title: "Luxury Brand Gala",
    date: "Mar 21, 2026",
    venue: "Noir Atelier",
    tickets: "42 seats left",
    href: "/events",
  },
  {
    title: "Private Art Soiree",
    date: "Mar 28, 2026",
    venue: "Crown & Co Gallery",
    tickets: "Invite only",
    href: "/events",
  },
  {
    title: "Corporate Mixer",
    date: "Apr 04, 2026",
    venue: "Aria Group HQ",
    tickets: "58 seats left",
    href: "/events",
  },
  {
    title: "VIP Nightlife",
    date: "Apr 10, 2026",
    venue: "Luxe District",
    tickets: "Waitlist",
    href: "/events",
  },
  {
    title: "Leadership Retreat",
    date: "Apr 18, 2026",
    venue: "Summit Lodge",
    tickets: "23 seats left",
    href: "/events",
  },
  {
    title: "Investor Showcase",
    date: "Apr 26, 2026",
    venue: "Maison Rive",
    tickets: "Limited seats",
    href: "/events",
  },
];

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default async function EventsPage() {
  const user = await getCurrentUser();
  const backHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "ORGANIZER"
        ? "/organizer"
        : user?.role === "USER"
          ? "/attendee"
          : "/";

  const dbEvents = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
  });

  const featuredEvents =
    dbEvents.length > 0
      ? dbEvents
          .filter((event) => event.id)
          .slice(0, 2)
          .map((event, index) => ({
            id: event.id,
            title: event.title,
            date: formatDate(event.startAt),
            venue: event.venue,
            status: event.capacity > 0 ? "Limited Seats" : "Invite Only",
            image:
              index === 0
                ? "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
                : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
          }))
      : fallbackFeaturedEvents.map((event) => ({ ...event, id: "" }));

  const eventCards =
    dbEvents.length > 0
      ? dbEvents
          .filter((event) => event.id)
          .map((event) => ({
            title: event.title,
            date: formatDate(event.startAt),
            venue: event.venue,
            tickets: `${event.capacity} seats left`,
            href: `/events/${encodeURIComponent(event.id)}`,
          }))
      : fallbackEventCards;

  return (
    <main
      className={`${bodyFont.className} min-h-screen text-[#f3eee6]`}
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(216,178,111,0.15), transparent 40%), radial-gradient(circle at 85% 20%, rgba(92,88,126,0.22), transparent 45%), #090b11",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 md:px-10">
        <div className="mb-6">
          <a
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-[#ead8b4] bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f8efde] transition hover:bg-black/55"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to dashboard
          </a>
        </div>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#d8b26f]">Events</p>
            <h1 className={`${headingFont.className} mt-4 text-4xl text-[#f6e7c8] md:text-6xl`}>
              Curated Experiences for Elite Hosts
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[#cbd2e7] md:text-base">
              Browse premium events, manage invitations, and monitor guest flow with precision.
            </p>
          </div>
        </header>

        <section className="mt-8 grid gap-3 rounded-2xl border border-[#2a3248] bg-[#12192a] p-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="flex items-center gap-2 rounded-xl border border-[#222c48] bg-[#0f1527] px-3 py-2">
            <span className="text-[#93a1c6]">???</span>
            <input
              placeholder="Search events"
              className="w-full bg-transparent text-sm text-[#f3eee6] outline-none placeholder:text-[#7f8cad]"
            />
          </div>
          <select className="rounded-xl border border-[#222c48] bg-[#0f1527] px-3 py-2 text-sm text-[#cbd2e7] outline-none">
            <option>All event types</option>
            <option>Invite only</option>
            <option>Corporate</option>
            <option>Nightlife</option>
          </select>
          <select className="rounded-xl border border-[#222c48] bg-[#0f1527] px-3 py-2 text-sm text-[#cbd2e7] outline-none">
            <option>Upcoming dates</option>
            <option>Next 7 days</option>
            <option>Next 30 days</option>
          </select>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredEvents.map((event) => (
            <EventCardLink
              key={event.title}
              href={event.id ? `/events/${event.id}` : "/events"}
              ariaLabel={`View details for ${event.title}`}
              className="relative z-10 overflow-hidden rounded-3xl border border-[#2a3248] bg-[#101827]"
            >
              <div
                className="h-48 bg-cover bg-center md:h-56"
                style={{ backgroundImage: `url('${event.image}')` }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090b11] via-transparent to-transparent" />
              <div className="relative space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">{event.status}</p>
                <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>
                  {event.title}
                </h2>
                <p className="text-sm text-[#cbd2e7]">
                  {event.date} ?? {event.venue}
                </p>
                <div className="pt-4">
                  <span className="inline-flex items-center rounded-full border border-[#ead8b4] bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f8efde] transition group-hover:bg-black/55">
                    View Details
                  </span>
                </div>
              </div>
            </EventCardLink>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8]`}>Upcoming</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-[#9aa4b8]">
              Updated weekly
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventCards.map((event) => (
              <EventCardLink
                key={event.title}
                href={event.href}
                ariaLabel={`Reserve for ${event.title}`}
                className="relative z-10 rounded-2xl border border-[#2a3248] bg-[#12192a] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#d8b26f]">{event.date}</p>
                <h3 className={`${headingFont.className} mt-3 text-2xl text-[#f6e7c8]`}>
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-[#b8bfd3]">{event.venue}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-[#9aa4b8]">
                  <span>{event.tickets}</span>
                  <span className="text-[#d8b26f] group-hover:text-[#f6e7c8]">
                    Reserve
                  </span>
                </div>
              </EventCardLink>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#2a3248] bg-[#12192a] p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <h2 className={`${headingFont.className} text-3xl text-[#f6e7c8] md:text-4xl`}>
            Host an unforgettable experience
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#cbd2e7] md:text-base">
            Create a premium event, control guest access, and track attendance in real time.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/events/new"
              className="rounded-full bg-[#d8b26f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#151515] transition hover:brightness-110"
            >
              Start Event
            </Link>
            <Link
              href="/apply-access"
              className="rounded-full border border-[#ead8b4] bg-black/35 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f8efde] transition hover:bg-black/55"
            >
              Apply for Access
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
