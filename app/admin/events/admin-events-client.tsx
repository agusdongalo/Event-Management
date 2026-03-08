"use client";

import { useMemo, useState, type FormEvent } from "react";

type EventStatus = "Live" | "Upcoming" | "Draft";

type EventItem = {
  title: string;
  date: string;
  venue: string;
  status: EventStatus;
  seats: number;
};

const statusOptions: EventStatus[] = ["Live", "Upcoming", "Draft"];

type OrganizerOption = {
  id: string;
  name: string;
  email: string;
};

type EventSeed = {
  title: string;
  date: string;
  venue: string;
  status: string;
  seats: number;
};

type Props = {
  initialEvents: EventSeed[];
  organizers: OrganizerOption[];
};

export default function AdminEventsClient({ initialEvents, organizers }: Props) {
  const [events, setEvents] = useState<EventItem[]>(
    initialEvents.map((event) => ({
      ...event,
      status:
        event.status === "Live" || event.status === "Draft" ? event.status : "Upcoming",
    }))
  );
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [organizerId, setOrganizerId] = useState(
    () => String(organizers[0]?.id ?? "")
  );
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    status: "Upcoming" as EventStatus,
    seats: "50",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEvents = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery =
        loweredQuery.length === 0 ||
        event.title.toLowerCase().includes(loweredQuery) ||
        event.venue.toLowerCase().includes(loweredQuery);
      const matchesStatus =
        statusFilter === "All statuses" || event.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [events, query, statusFilter]);

  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      venue: "",
      status: "Upcoming",
      seats: "50",
    });
    setError("");
  };

  const resolvedOrganizerId = organizerId || String(organizers[0]?.id ?? "");

  const openModal = () => {
    resetForm();
    if (organizers[0]) setOrganizerId(String(organizers[0].id));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = form.title.trim();
    const date = form.date.trim();
    const venue = form.venue.trim();
    const status = form.status;
    const selectedOrganizerId = resolvedOrganizerId;
    const seatsValue = form.seats;
    if (!title || !date || !venue || !selectedOrganizerId) {
      setError("Title, date, venue, and organizer are required.");
      return;
    }
    const seatsNumber = Number(seatsValue);
    if (!Number.isFinite(seatsNumber) || seatsNumber < 0) {
      setError("Seats must be a non-negative number.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          venue,
          status: status.toUpperCase(),
          seats: seatsNumber,
          organizerId: selectedOrganizerId,
        }),
      });

      const payload = (await response.json()) as {
        event?: EventItem;
        error?: string;
      };

      if (!response.ok || !payload.event) {
        setError(payload.error ?? "Unable to create event.");
        return;
      }

      setEvents((prev) => [payload.event!, ...prev]);
      closeModal();
    } catch {
      setError("Unable to create event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative z-0 mb-4 grid gap-3 md:grid-cols-[1.2fr_0.6fr_0.4fr]">
        <div className="organizer-top-shadow flex h-11 items-center gap-2 rounded-xl border border-transparent bg-white px-3 shadow-sm">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4 text-[#8b93ad]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            placeholder="Search events"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-full w-full bg-transparent text-sm text-[#1a1f35] outline-none placeholder:text-[#9aa2b6]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="organizer-top-shadow h-11 rounded-xl border border-transparent bg-white px-3 text-sm text-[#4a5b87] outline-none shadow-sm"
        >
          <option>All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={openModal}
          className="organizer-top-shadow h-11 rounded-xl bg-[#3b5dd0] text-sm font-semibold text-white shadow-md transition hover:bg-[#3352c5]"
        >
          + Add Event
        </button>
      </div>

      <div className="organizer-top-shadow relative z-10 rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid gap-2 text-sm font-semibold text-[#4a5b87] sm:grid-cols-[2fr_1fr_1fr_1fr]">
          <span>Event</span>
          <span>Date</span>
          <span>Status</span>
          <span>Seats Left</span>
        </div>
        <div className="mt-3 space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e0e5f2] px-4 py-6 text-center text-sm text-[#6b7593]">
              No events match your filters.
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={`${event.title}-${event.date}`}
                className="organizer-list-shadow grid items-center gap-2 rounded-xl border border-[#eef1f7] bg-[#f9fafe] px-3 py-3 text-sm text-[#243054] sm:grid-cols-[2fr_1fr_1fr_1fr]"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs text-[#7b86a6]">{event.venue}</p>
                </div>
                <span className="text-[#6b7593]">{event.date}</span>
                <span
                  className={`w-fit rounded-full px-2 py-1 text-xs organizer-badge ${
                    event.status === "Live"
                      ? "bg-emerald-100 text-emerald-700"
                      : event.status === "Upcoming"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {event.status}
                </span>
                <span className="w-fit rounded-full bg-[#ede9ff] px-2 py-1 text-xs text-[#5c53d6] organizer-badge">
                  {event.seats}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1023]/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b7593]">New Event</p>
              <h2 className="text-2xl font-semibold text-[#1b2441]">Add Event</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-[#4a5b87]">
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, title: event.target.value }));
                    setError("");
                  }}
                  className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                  placeholder="Executive Summit"
                />
              </label>
              <label className="block text-sm text-[#4a5b87]">
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, date: event.target.value }));
                    setError("");
                  }}
                  className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                />
              </label>
              <label className="block text-sm text-[#4a5b87]">
                Venue
                <input
                  name="venue"
                  value={form.venue}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, venue: event.target.value }));
                    setError("");
                  }}
                  className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                  placeholder="Velvet Hall, NY"
                />
              </label>
              <label className="block text-sm text-[#4a5b87]">
                Organizer
                <select
                  name="organizerId"
                  value={resolvedOrganizerId}
                  onChange={(event) => {
                    setOrganizerId(String(event.target.value));
                    setError("");
                  }}
                  disabled={organizers.length === 0}
                  className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                >
                  <option value="" disabled>
                    Select organizer
                  </option>
                  {organizers.map((organizer) => (
                    <option key={organizer.id} value={String(organizer.id)}>
                      {organizer.name} ({organizer.email})
                    </option>
                  ))}
                </select>
                {organizers.length === 0 ? (
                  <span className="mt-2 block text-xs text-rose-500">
                    No valid organizers found. Create an organizer account first.
                  </span>
                ) : null}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-[#4a5b87]">
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={(event) => {
                      setForm((prev) => ({ ...prev, status: event.target.value as EventStatus }));
                      setError("");
                    }}
                    className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-[#4a5b87]">
                  Seats left
                  <input
                    type="number"
                    min="0"
                    name="seats"
                    value={form.seats}
                    onChange={(event) => {
                      setForm((prev) => ({ ...prev, seats: event.target.value }));
                      setError("");
                    }}
                    className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                    placeholder="50"
                  />
                </label>
              </div>
              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 rounded-xl border border-[#d9dff0] px-4 text-sm font-semibold text-[#4a5b87] transition hover:bg-[#f3f5fb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-[#3b5dd0] px-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#3352c5] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
