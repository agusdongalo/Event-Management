"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SearchItem = {
  type: "Event" | "Registration" | "Attendee" | "Message" | "Task" | "Page";
  title: string;
  subtitle?: string;
  href: string;
};

const searchItems: SearchItem[] = [
  { type: "Page", title: "Events", subtitle: "Admin Events", href: "/admin/events" },
  { type: "Page", title: "Registrations", subtitle: "Admin Registrations", href: "/admin/registrations" },
  { type: "Page", title: "Attendees", subtitle: "Admin Attendees", href: "/admin/attendees" },
  { type: "Page", title: "Analytics", subtitle: "Admin Analytics", href: "/admin/analytics" },
  { type: "Page", title: "Messages", subtitle: "Admin Messages", href: "/admin/messages" },
  { type: "Page", title: "Settings", subtitle: "Admin Settings", href: "/admin/settings" },
  { type: "Event", title: "Executive Summit", subtitle: "Velvet Hall, NY", href: "/admin/events" },
  { type: "Event", title: "Founder Dinner", subtitle: "Maison Rive, LA", href: "/admin/events" },
  { type: "Event", title: "Luxury Brand Gala", subtitle: "Noir Atelier", href: "/admin/events" },
  { type: "Event", title: "Private Art Soiree", subtitle: "Crown & Co Gallery", href: "/admin/events" },
  { type: "Registration", title: "Amelia Grant", subtitle: "Executive Summit", href: "/admin/registrations" },
  { type: "Registration", title: "Noah Sinclair", subtitle: "Founder Dinner", href: "/admin/registrations" },
  { type: "Registration", title: "Lena Hart", subtitle: "Luxury Brand Gala", href: "/admin/registrations" },
  { type: "Registration", title: "Marcus Cole", subtitle: "Luxury Brand Gala", href: "/admin/registrations" },
  { type: "Registration", title: "Sofia Lin", subtitle: "Private Art Soiree", href: "/admin/registrations" },
  { type: "Attendee", title: "Aria Summers", subtitle: "VIP • Executive Summit", href: "/admin/attendees" },
  { type: "Attendee", title: "Daniel Reed", subtitle: "Premium • Founder Dinner", href: "/admin/attendees" },
  { type: "Attendee", title: "Sofia Lin", subtitle: "VIP • Luxury Brand Gala", href: "/admin/attendees" },
  { type: "Attendee", title: "Noah Sinclair", subtitle: "Standard • Private Art Soiree", href: "/admin/attendees" },
  { type: "Message", title: "Maison Rive", subtitle: "VIP confirmations are ready to approve.", href: "/admin/messages" },
  { type: "Message", title: "Velvet Hall", subtitle: "Updated seating plan attached.", href: "/admin/messages" },
  { type: "Message", title: "Aria Group", subtitle: "Can we increase the guest cap?", href: "/admin/messages" },
  { type: "Message", title: "Luxe District", subtitle: "Need a final headcount by Friday.", href: "/admin/messages" },
  { type: "Task", title: "Approve Executive Summit registrations", href: "/admin" },
  { type: "Task", title: "Finalize VIP guest list", href: "/admin" },
  { type: "Task", title: "Assign check-in staff", href: "/admin" },
  { type: "Task", title: "Review venue security plan", href: "/admin" },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function AdminSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const normalized = normalize(query);
    if (!normalized) return [];
    return searchItems.filter((item) => {
      const haystack = `${item.type} ${item.title} ${item.subtitle ?? ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query]);

  const lockScroll = open && query.trim().length > 0;

  const handleSubmit = () => {
    if (!query.trim()) return;
    if (results.length > 0) {
      router.push(results[0].href);
    }
  };

  return (
    <div className="relative z-30 w-full max-w-xl">
      <div className="organizer-top-shadow relative flex h-11 w-full items-center rounded-xl border border-transparent bg-white px-3 shadow-sm">
        {query.trim() || focused ? (
          <button
            type="button"
            aria-label="Clear search"
            className="search-back-btn absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#8b93ad]"
            onClick={() => {
              setQuery("");
              setOpen(false);
              setFocused(false);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 12H6" />
              <path d="M12 6l-6 6 6 6" />
            </svg>
          </button>
        ) : null}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setOpen(false), 120);
          }}
          placeholder="Search task"
          className="search-input h-full w-full bg-transparent pl-10 pr-12 text-sm text-[#1a1f35] outline-none placeholder:text-[#9aa2b6]"
        />
        <button
          type="button"
          aria-label="Search"
          onClick={handleSubmit}
          className="search-icon-btn absolute top-1/2 z-10 -translate-y-1/2 text-[#8b93ad]"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full text-[#1a1f35] transition-all duration-400 ease-in-out">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </span>
        </button>
      </div>

      {open && query.trim() ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-[#e6eaf4] bg-white p-2 shadow-lg"
          onWheel={(event) => event.stopPropagation()}
        >
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[#7b86a6]">No matches found.</p>
          ) : (
            <ul
              className="max-h-64 space-y-2 overflow-auto pb-4"
              onWheel={(event) => event.stopPropagation()}
            >
              {results.slice(0, 8).map((result) => (
                <li key={`${result.type}-${result.title}`}>
                  <Link
                    href={result.href}
                    className="flex items-center justify-between rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-2 text-sm text-[#243054] transition hover:border-[#dbe2f3] hover:bg-white"
                  >
                    <div>
                      <p className="font-medium">{result.title}</p>
                      {result.subtitle ? (
                        <p className="text-xs text-[#7b86a6]">{result.subtitle}</p>
                      ) : null}
                    </div>
                    <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-[11px] font-semibold text-[#4052b8] organizer-badge">
                      {result.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
      {lockScroll ? (
        <div className="fixed inset-0 z-40" onWheel={(event) => event.preventDefault()} />
      ) : null}
    </div>
  );
}
