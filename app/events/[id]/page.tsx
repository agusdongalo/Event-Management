import { redirect } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EventRegisterClient from "./event-register-client";

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

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!resolvedParams?.id) redirect("/events");
  let eventId = resolvedParams.id;
  try {
    eventId = decodeURIComponent(resolvedParams.id);
  } catch {
    redirect("/events");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: { select: { name: true, email: true } },
    },
  });

  if (!event) {
    return (
      <main
        className={`${bodyFont.className} min-h-screen px-4 py-10 text-[#f3eee6] md:px-10`}
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(216,178,111,0.15), transparent 40%), radial-gradient(circle at 85% 20%, rgba(92,88,126,0.22), transparent 45%), #090b11",
        }}
      >
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#2a3248] bg-[#12192a] p-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d8b26f]">Event</p>
          <h1 className={`${headingFont.className} mt-3 text-3xl text-[#f6e7c8]`}>
            Event not found
          </h1>
          <p className="mt-3 text-sm text-[#cbd2e7]">
            The event you tried to open doesn’t exist or was removed.
          </p>
          <a
            href="/events"
            className="mt-5 inline-flex rounded-full border border-[#ead8b4] bg-black/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f8efde] transition hover:bg-black/55"
          >
            Back to events
          </a>
        </div>
      </main>
    );
  }

  const registrationsCount = await prisma.registration.count({
    where: {
      eventId: event.id,
      status: { in: ["PENDING", "APPROVED", "REGISTERED"] },
    },
  });
  const seatsLeft = Math.max(event.capacity - registrationsCount, 0);
  const existingRegistration = await prisma.registration.findUnique({
    where: {
      eventId_userId: {
        eventId: event.id,
        userId: user.id,
      },
    },
    select: { id: true, tier: true, createdAt: true, status: true },
  });
  const registrationStatus =
    existingRegistration?.status === "REGISTERED"
      ? "APPROVED"
      : existingRegistration?.status ?? null;

  return (
    <main
      className={`${bodyFont.className} min-h-screen px-4 py-10 text-[#f3eee6] md:px-10`}
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(216,178,111,0.15), transparent 40%), radial-gradient(circle at 85% 20%, rgba(92,88,126,0.22), transparent 45%), #090b11",
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <section className="flex-1">
            <a
              href="/attendee/events"
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
              Back to events
            </a>
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-[#d8b26f]">Event</p>
            <h1 className={`${headingFont.className} mt-3 text-4xl text-[#f6e7c8] md:text-5xl`}>
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#cbd2e7]">
              <span>{formatDate(event.startAt)}</span>
              <span>·</span>
              <span>{event.venue}</span>
              <span>·</span>
              <span>{seatsLeft} seats left</span>
            </div>
            <div className="mt-3 text-sm text-[#cbd2e7]">
              Event organizer:{" "}
              <span className="font-semibold text-[#f6e7c8]">{event.organizer.name}</span>{" "}
              <span className="text-[#9aa4b8]">({event.organizer.email})</span>
            </div>
            {event.description ? (
              <p className="mt-5 text-sm leading-7 text-[#cbd2e7]">{event.description}</p>
            ) : null}

            {existingRegistration ? (
              <div
                className={`mt-6 rounded-2xl border p-4 text-sm ${
                  registrationStatus === "APPROVED"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
                    : registrationStatus === "PENDING"
                      ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                      : registrationStatus === "REJECTED"
                        ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
                        : "border-slate-500/30 bg-slate-500/10 text-slate-100"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.3em]">
                  {registrationStatus === "APPROVED"
                    ? "You are registered"
                    : registrationStatus === "PENDING"
                      ? "Awaiting confirmation"
                      : registrationStatus === "REJECTED"
                        ? "Registration declined"
                        : "Registration status"}
                </p>
                <p className="mt-2">
                  Tier:{" "}
                  <span className="font-semibold">
                    {existingRegistration.tier === "PREMIUM"
                      ? "Premium"
                      : existingRegistration.tier === "VIP"
                        ? "VIP"
                        : "Standard"}
                  </span>
                </p>
                <p className="mt-1">
                  Requested on {formatDate(existingRegistration.createdAt)} -{" "}
                  {existingRegistration.status.toLowerCase()}
                </p>
              </div>
            ) : null}
          </section>

          <aside className="w-full max-w-xl">
            <EventRegisterClient
              eventId={event.id}
              seatsLeft={seatsLeft}
              registeredTier={existingRegistration?.tier ?? null}
              registrationStatus={registrationStatus}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
