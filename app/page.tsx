import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const trustLogos = [
  "Velvet Hall",
  "Noir Atelier",
  "Aria Group",
  "Maison Rive",
  "Luxe District",
  "Crown & Co",
];

const testimonials = [
  {
    quote:
      "Our guest flow went from chaotic to cinematic. We finally run check-in like a private club.",
    name: "A. Cole",
    role: "Director, Maison Rive",
  },
  {
    quote:
      "The control over invitations and live capacity is the difference between sold-out and overbooked.",
    name: "R. James",
    role: "Founder, Velvet Hall",
  },
  {
    quote:
      "We onboarded our VIP events in one afternoon. The interface feels like a luxury concierge.",
    name: "M. Patel",
    role: "Events Lead, Aria Group",
  },
];

const experienceSteps = [
  {
    title: "Curate",
    copy: "Design a refined event page with bespoke branding and precise guest controls.",
  },
  {
    title: "Invite",
    copy: "Share privately or publicly. Approve guest lists without losing exclusivity.",
  },
  {
    title: "Orchestrate",
    copy: "Live guest tracking, instant insights, and seamless entry flow at the door.",
  },
];

const premiumPoints = [
  "Precise registration with live capacity protection",
  "VIP check-in workflows that feel effortless",
  "Organizer dashboard with real-time guest intelligence",
  "Privacy-first invite controls for elite audiences",
];

const audience = [
  "Luxury venue owners",
  "Private event promoters",
  "Corporate event planners",
  "VIP nightlife organizers",
];

export default async function Home() {
  const user = await getCurrentUser();
  if (user?.role === "ADMIN") redirect("/admin");

  const primaryHref = user ? "/events/new" : "/signup";
  const secondaryHref = user ? "/events" : "/login";

  const navActions = (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-full border border-white/70 px-4 py-1 text-xs font-extrabold tracking-wide text-white transition hover:bg-white hover:text-black"
      >
        LOGIN
      </Link>
      <Link
        href="/signup"
        className="rounded-full border border-white/70 bg-white/20 px-4 py-1 text-xs font-extrabold tracking-wide text-white transition hover:bg-white hover:text-black"
      >
        SIGN UP
      </Link>
    </div>
  );

  return (
    <main className={`${bodyFont.className} bg-[#090b11] text-[#f3eee6]`}>
      <section
        id="home"
        className="relative min-h-screen overflow-hidden px-6 pb-14 pt-7 text-white md:px-10"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(9,11,17,0.86) 0%, rgba(16,22,36,0.82) 48%, rgba(36,18,42,0.7) 100%), url('https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&w=2200&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(214,168,92,0.18),transparent_42%),radial-gradient(circle_at_85%_70%,rgba(92,88,126,0.16),transparent_45%)]" />

        <div className="relative mx-auto max-w-6xl">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d8b26f] bg-black/40 text-xs tracking-[0.25em] text-[#d8b26f]">
                SE
              </div>
              <p className={`${headingFont.className} text-4xl tracking-wide text-[#f6e7c8]`}>
                SuperDon Elite
              </p>
            </div>
            <div className="flex items-center gap-3">
              {navActions}
              <div className="hidden items-center gap-2 md:flex">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/70 text-[10px]">
                  IG
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/70 text-[10px]">
                  IN
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/70 text-[10px]">
                  X
                </span>
              </div>
            </div>
          </header>

          <nav className="mt-6 flex flex-wrap justify-end gap-6 text-sm text-white/80">
            <a href="#home" className="hover:text-white">
              Home
            </a>
            <a href="#trust" className="hover:text-white">
              Trust
            </a>
            <a href="#experience" className="hover:text-white">
              The Experience
            </a>
            <a href="#preview" className="hover:text-white">
              Platform
            </a>
            <a href="#value" className="hover:text-white">
              Value
            </a>
            <a href="#contact" className="hover:text-white">
              Access
            </a>
          </nav>

          <div className="mx-auto mt-24 max-w-4xl text-center md:mt-32">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d8b26f]">
              Private Event Operations
            </p>
            <h1 className={`${headingFont.className} mt-5 text-5xl leading-[1] md:text-7xl`}>
              The Private Event Platform for Elite Hosts
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-[#f5efe4]/90 md:text-xl">
              Built for high-end event hosts who demand precision, privacy, and seamless guest flow.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={primaryHref}
                className="rounded-full bg-[#d8b26f] px-9 py-3 text-sm font-bold tracking-[0.16em] text-[#151515] shadow-[0_0_28px_rgba(216,178,111,0.45)] transition hover:brightness-110"
              >
                {user ? "CREATE EVENT" : "APPLY FOR ACCESS"}
              </Link>
              <Link
                href={secondaryHref}
                className="rounded-full border border-[#ead8b4] bg-black/35 px-9 py-3 text-sm font-bold tracking-[0.16em] text-[#f8efde] transition hover:bg-black/55"
              >
                {user ? "VIEW DASHBOARD" : "VIEW DEMO"}
              </Link>
            </div>
          </div>

          <div className="mt-16 flex justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f5e5bf]" />
            <span className="h-2 w-2 rounded-full bg-[#f5e5bf]/70" />
            <span className="h-2 w-2 rounded-full bg-[#f5e5bf]/45" />
          </div>
        </div>
      </section>

      <section id="trust" className="bg-[#0b0f1a] px-6 py-16 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">Trusted by</p>
          <div className="mt-6 grid gap-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#cbd2e7] sm:grid-cols-3 lg:grid-cols-6">
            {trustLogos.map((logo) => (
              <div
                key={logo}
                className="rounded-full border border-[#2a3248] bg-[#101827] px-4 py-3"
              >
                {logo}
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="rounded-3xl border border-[#2a3248] bg-[#12192a] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              >
                <p className="text-sm text-[#e6dcc8]">"{item.quote}"</p>
                <p className="mt-5 text-xs uppercase tracking-[0.3em] text-[#d8b26f]">
                  {item.name}
                </p>
                <p className="text-xs text-[#9aa4b8]">{item.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="bg-[#0d111d] px-6 py-16 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className={`${headingFont.className} text-center text-5xl text-[#f6e7c8] md:text-6xl`}>
            The Experience
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#b8bfd3] md:text-base">
            Elevated tools for event teams who value discretion and flawless execution.
          </p>
          <div className="mt-12 grid gap-8 text-center md:grid-cols-3">
            {experienceSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-[#2a3248] bg-[#12192a] px-6 py-9 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#d8b26f] text-lg font-semibold text-[#d8b26f]">
                  0{index + 1}
                </div>
                <h3 className={`${headingFont.className} mt-5 text-4xl text-[#f7e9cc]`}>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#b9c1d4]">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="bg-[#0a0f1b] px-6 py-16 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">
                Inside the Platform
              </p>
              <h2 className={`${headingFont.className} mt-4 text-5xl text-[#f6e7c8] md:text-6xl`}>
                Inside the SuperDon Elite Platform
              </h2>
              <p className="mt-5 max-w-xl text-sm text-[#b9c1d4] md:text-base">
                A glassmorphism interface built for premium operations: guest lists, live check-ins, and
                real-time event insights in one serene workspace.
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#d8b26f]">Dashboard</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-[#0e1626] p-4">
                      <p className="text-xs text-[#9aa4b8]">Guest Arrival</p>
                      <p className="mt-3 text-2xl font-semibold text-[#f6e7c8]">94% On-Time</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#0e1626] p-4">
                      <p className="text-xs text-[#9aa4b8]">Live Capacity</p>
                      <p className="mt-3 text-2xl font-semibold text-[#f6e7c8]">312 / 330</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#d8b26f]">Guest List</p>
                  <div className="mt-4 space-y-3">
                    {["Aria Summers", "Noah Sinclair", "Lena Hart"].map((name) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0e1626] px-4 py-3 text-sm"
                      >
                        <span>{name}</span>
                        <span className="rounded-full bg-[#1b2a25] px-3 py-1 text-xs text-[#9df2c2]">
                          Checked In
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#d8b26f]">Mobile Check-In</p>
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0e1626] p-5">
                  <div className="flex items-center justify-between text-xs text-[#9aa4b8]">
                    <span>Tonight</span>
                    <span>VIP Lounge</span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-[#f6e7c8]">Guest Verify</p>
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                    <p className="text-xs text-[#9aa4b8]">Scan Result</p>
                    <p className="mt-2 text-lg text-[#9df2c2]">Approved</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#101827] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#d8b26f]">Insights</p>
                <p className="mt-4 text-sm text-[#b9c1d4]">
                  See arrivals, guest tiers, and revenue in seconds with a calm, focused interface.
                </p>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-xl border border-white/10 bg-[#0e1626] p-4">
                    <p className="text-xs text-[#9aa4b8]">Average Check-In</p>
                    <p className="mt-2 text-2xl text-[#f6e7c8]">4.7s</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0e1626] p-4">
                    <p className="text-xs text-[#9aa4b8]">Overbooking</p>
                    <p className="mt-2 text-2xl text-[#f6e7c8]">0%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="value" className="grid min-h-screen md:grid-cols-2">
        <div
          className="min-h-[50vh] md:min-h-screen"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(9,8,20,0.76), rgba(78,34,98,0.38)), url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="grid min-h-[50vh] content-center bg-[#130f1f] px-8 py-14 text-white md:min-h-screen md:px-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">Value</p>
          <h2 className={`${headingFont.className} mt-4 text-5xl text-[#f6e7c8] md:text-6xl`}>
            Why Premium Hosts Choose Us
          </h2>
          <ul className="mt-8 space-y-4 text-base text-[#d6d8e4]">
            {premiumPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#2a3248] bg-[#101523] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9aa4b8]">Overbooking</p>
              <p className="mt-2 text-3xl font-semibold text-[#f6e7c8]">0%</p>
            </div>
            <div className="rounded-2xl border border-[#2a3248] bg-[#101523] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9aa4b8]">Real-Time</p>
              <p className="mt-2 text-3xl font-semibold text-[#f6e7c8]">100%</p>
            </div>
            <div className="rounded-2xl border border-[#2a3248] bg-[#101523] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9aa4b8]">Check-In</p>
              <p className="mt-2 text-3xl font-semibold text-[#f6e7c8]">&lt; 5s</p>
            </div>
          </div>
        </div>
      </section>

      <section id="audience" className="bg-[#0b0f1a] px-6 py-16 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">Designed for</p>
          <h2 className={`${headingFont.className} mt-4 text-5xl text-[#f6e7c8] md:text-6xl`}>
            Made for the Hosts Who Shape the Night
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audience.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#2a3248] bg-[#12192a] px-5 py-6 text-sm text-[#d6d8e4]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative grid min-h-screen items-center overflow-hidden bg-[#050812] px-6 py-16"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(41,56,114,0.4),transparent_45%),radial-gradient(circle_at_70%_75%,rgba(82,42,116,0.22),transparent_45%)]" />
        <div className="relative mx-auto w-full max-w-4xl rounded-[28px] border border-[#2e3448] bg-[#0a1020]/88 px-6 py-10 shadow-[0_26px_60px_rgba(0,0,0,0.5)] md:px-10 md:py-12">
          <h2 className={`${headingFont.className} text-center text-5xl text-[#e2c48e] md:text-6xl`}>
            Apply for Elite Access
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#b9c1d4]">
            Access reserved for verified hosts and premium venues.
          </p>
          <form className="mx-auto mt-10 max-w-2xl space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="h-11 rounded-md border border-[#27314b] bg-[#0a1020]/80 px-3 text-sm text-[#ece8de] outline-none placeholder:text-[#8f97ab] focus:border-[#d7b276]"
                placeholder="First Name"
              />
              <input
                className="h-11 rounded-md border border-[#27314b] bg-[#0a1020]/80 px-3 text-sm text-[#ece8de] outline-none placeholder:text-[#8f97ab] focus:border-[#d7b276]"
                placeholder="Last Name"
              />
            </div>
            <input
              className="h-11 w-full rounded-md border border-[#27314b] bg-[#0a1020]/80 px-3 text-sm text-[#ece8de] outline-none placeholder:text-[#8f97ab] focus:border-[#d7b276]"
              placeholder="Phone Number"
            />
            <input
              className="h-11 w-full rounded-md border border-[#27314b] bg-[#0a1020]/80 px-3 text-sm text-[#ece8de] outline-none placeholder:text-[#8f97ab] focus:border-[#d7b276]"
              placeholder="Email Address"
            />
            <input
              className="h-11 w-full rounded-md border border-[#27314b] bg-[#0a1020]/80 px-3 text-sm text-[#ece8de] outline-none placeholder:text-[#8f97ab] focus:border-[#d7b276]"
              placeholder="Company or Venue"
            />
            <div className="pt-5 text-center">
              <Link
                href={primaryHref}
                className="inline-flex h-12 min-w-48 items-center justify-center rounded-full bg-[linear-gradient(90deg,#ba9054_0%,#e2c48e_55%,#c89f63_100%)] px-9 text-sm font-bold tracking-[0.16em] text-[#16140f] shadow-[0_0_30px_rgba(216,178,111,0.35)] transition hover:brightness-110"
              >
                {user ? "CREATE EVENT" : "REQUEST ACCESS"}
              </Link>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-[#080b14] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-10 text-xs text-[#b0b8cd] md:px-10">
          <div>
            <p className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>SuperDon Elite</p>
            <p className="mt-2 max-w-xs text-xs text-[#9aa4b8]">
              SuperDon Elite - Elevating events since 2024.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-[#f6e7c8]">
              About
            </a>
            <a href="#" className="hover:text-[#f6e7c8]">
              Privacy
            </a>
            <a href="#" className="hover:text-[#f6e7c8]">
              Terms
            </a>
            <a href="#" className="hover:text-[#f6e7c8]">
              Contact
            </a>
            <a href="#" className="hover:text-[#f6e7c8]">
              Instagram
            </a>
          </div>
          <p>Copyright 2026 SuperDon Elite Events. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
