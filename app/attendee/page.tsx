import { redirect } from "next/navigation";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
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

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export default async function AttendeeAccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "ORGANIZER") redirect("/organizer");

  const registrations = await prisma.registration.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      event: { select: { title: true, startAt: true } },
    },
  });


  const approvedRegistrations = registrations.filter(
    (registration) => registration.status === "APPROVED" || registration.status === "REGISTERED"
  );
  const today = getStartOfToday();
  const upcomingRegistrations = approvedRegistrations.filter(
    (registration) => registration.event.startAt >= today
  );
  const pastRegistrations = approvedRegistrations.filter(
    (registration) => registration.event.startAt < today
  );

  const upcomingRegistered = upcomingRegistrations.slice(0, 3).map((registration) => ({
    name: registration.event.title,
    date: formatDate(registration.event.startAt),
    status: "Registered",
  }));

  const upcomingFromAllEvents = await prisma.event.findMany({
    where: {
      startAt: { gte: today },
    },
    orderBy: { startAt: "asc" },
    take: 3,
    select: { title: true, startAt: true },
  });

  const upcomingCount =
    upcomingRegistrations.length > 0 ? upcomingRegistrations.length : upcomingFromAllEvents.length;

  const quickStats = [
    { label: "Active Tickets", value: approvedRegistrations.length.toString() },
    { label: "Upcoming Events", value: upcomingCount.toString() },
    { label: "Saved Events", value: "0" },
  ];

  const upcomingEvents =
    upcomingRegistered.length > 0
      ? upcomingRegistered
      : upcomingFromAllEvents.map((event) => ({
          name: event.title,
          date: formatDate(event.startAt),
          status: "Upcoming",
        }));

  const recentEvents = pastRegistrations.slice(0, 2).map((registration) => ({
    name: registration.event.title,
    date: formatDate(registration.event.startAt),
    status: "Attended",
  }));

  return (
    <main
      className={`${bodyFont.className} min-h-screen text-[#f3eee6]`}
      style={{
        background:
          "radial-gradient(circle at 15% 15%, rgba(216,178,111,0.18), transparent 38%), radial-gradient(circle at 85% 20%, rgba(104,34,98,0.22), transparent 40%), #090b11",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.45em] text-[#d8b26f]">Attendee Account</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <h1 className={`${headingFont.className} text-4xl text-[#f6e7c8] md:text-6xl`}>
                <span className="block">Welcome back, Guest</span>
                <span className="italic">{user.name}</span>
              </h1>
              <div className="hidden items-center gap-3 rounded-full border border-[#2a3248] bg-[#12192a] px-4 py-2 md:inline-flex">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#d8b26f] text-sm font-semibold text-[#151515]">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="pr-2">
                  <p className="text-sm font-semibold text-[#f3eee6]">{user.name}</p>
                  <p className="text-xs text-[#9aa4b8]">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/events"
                className="attendee-gold-cta rounded-full border border-[#ead8b4] bg-black/40 px-4 py-2 text-xs font-semibold text-[#f6e7c8] shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition hover:bg-black/60"
              >
                Browse Events
              </Link>
              <LogoutButton
                containerClassName="flex"
                className="rounded-full border border-[#ead8b4] bg-black/25 px-4 py-2 text-xs font-semibold text-[#f6e7c8] shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition hover:bg-black/50"
                errorClassName="text-[11px] text-rose-200"
                redirectTo="/"
              />
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {quickStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-[#2a3248] bg-[#12192a] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#d6d8e4]">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-[#f6e7c8]">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-[#2a3248] bg-[#12192a] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <h2 className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>Upcoming Events</h2>
              <Link href="/attendee/events" className="text-xs text-[#d8b26f]">
                View All
              </Link>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {upcomingEvents.map((event) => (
                <div
                  key={event.name}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-[#f3eee6]">{event.name}</p>
                    <p className="text-xs text-[#9aa4b8]">{event.date}</p>
                  </div>
                  <span className="rounded-full bg-[#1f2d28] px-3 py-1 text-xs font-semibold text-[#9df2c2]">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[#2a3248] bg-[#12192a] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.45)]">
            <h2 className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>Account</h2>
            <div className="mt-4 space-y-3 text-sm text-[#d6d8e4]">
              <div className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Membership</p>
                <p className="mt-2 font-semibold text-[#f3eee6]">Standard Attendee</p>
              </div>
              <div className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Notifications</p>
                <p className="mt-2 font-semibold text-[#f3eee6]">Email + SMS</p>
              </div>
              <div className="rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Payment Method</p>
                <p className="mt-2 font-semibold text-[#f3eee6]">Visa •••• 4242</p>
              </div>
            </div>
            <Link
              href="/profile"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[linear-gradient(90deg,#ba9054_0%,#e2c48e_55%,#c89f63_100%)] px-4 py-2 text-xs font-semibold text-[#16140f] transition hover:brightness-110"
            >
              View Profile
            </Link>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-[#2a3248] bg-[#12192a] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.45)] hidden md:block">
          <div className="flex items-center justify-between">
            <h2 className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>Recent Events</h2>
            <Link href="/attendee/events" className="text-xs text-[#d8b26f]">
              View History
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {recentEvents.map((event) => (
              <div
                key={event.name}
                className="flex items-center justify-between rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-[#f3eee6]">{event.name}</p>
                  <p className="text-xs text-[#9aa4b8]">{event.date}</p>
                </div>
                <span className="rounded-full bg-[#2a2647] px-3 py-1 text-xs font-semibold text-[#c7c2ff]">
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
