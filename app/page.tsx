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
        className="rounded-full border border-[#ead8b4] bg-[#d8b26f] px-4 py-1 text-xs font-extrabold tracking-wide text-[#151515] transition hover:brightness-110"
      >
        SIGN UP
      </Link>
    </div>
  );

  return (
    <main className={`${bodyFont.className} w-full overflow-x-hidden bg-[#090b11] text-[#f3eee6]`}>
      <section
        id="home"
        className="relative min-h-screen overflow-hidden px-5 pb-14 pt-6 text-white sm:px-6 md:px-10"
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
              <p className={`${headingFont.className} text-2xl tracking-wide text-[#f6e7c8] sm:text-4xl`}>
                SuperDon Elite
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-between gap-8 sm:w-auto sm:flex-nowrap">
              {navActions}
            </div>
          </header>

          <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/80 sm:justify-end sm:gap-6">
            <a href="#home" className="hover:text-white">
              Home
            </a>
            <a href="#experience" className="hover:text-white">
              The Experience
            </a>
            <a href="#preview" className="hover:text-white">
              Platform
            </a>
            <a href="#contact" className="hover:text-white">
              Access
            </a>
          </nav>

          <div className="mx-auto mt-20 max-w-4xl text-center md:mt-32">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d8b26f]">
              Private Event Operations
            </p>
            <h1
              className={`${headingFont.className} mt-7 text-4xl leading-[1.05] sm:text-5xl md:text-7xl`}
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              The Private Event Platform for Elite Hosts
            </h1>
            <p
              className="mx-auto mt-5 max-w-2xl text-sm text-[#f5efe4]/90 sm:text-base md:text-xl"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Built for high-end event hosts who demand precision, privacy, and seamless guest flow.
            </p>
            <div
              className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <Link
                href={primaryHref}
                className="w-full rounded-full bg-[#d8b26f] px-9 py-3 text-sm font-bold tracking-[0.16em] text-[#151515] shadow-[0_0_28px_rgba(216,178,111,0.45)] transition hover:brightness-110 sm:w-auto"
              >
                {user ? "CREATE EVENT" : "APPLY FOR ACCESS"}
              </Link>
              <Link
                href={secondaryHref}
                className="w-full rounded-full border border-[#ead8b4] bg-black/35 px-9 py-3 text-sm font-bold tracking-[0.16em] text-[#f8efde] transition hover:bg-black/55 sm:w-auto"
              >
                {user ? "VIEW DASHBOARD" : "VIEW DEMO"}
              </Link>
            </div>
            <p className="mt-3 text-xs text-[#d8caa7]/70">
              Access reserved for verified hosts and premium venues.
            </p>
          </div>

          <div className="mt-12 flex justify-center gap-2 sm:mt-16">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5e5bf]/65" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5e5bf]/45" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5e5bf]/30" />
          </div>
        </div>
      </section>

      <section id="trust" className="bg-[#0b0f1a] px-5 py-14 sm:px-6 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">Trusted by</p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#cbd2e7] sm:grid-cols-3 sm:gap-4 sm:text-xs lg:grid-cols-6">
            {trustLogos.map((logo) => (
              <div
                key={logo}
                className="rounded-full border border-[#2a3248] bg-[#101827] px-4 py-3"
              >
                {logo}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
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

      <section id="experience" className="bg-[#0d111d] px-5 py-14 sm:px-6 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className={`${headingFont.className} text-center text-4xl text-[#f6e7c8] sm:text-5xl md:text-6xl`}>
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
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay={index === 0 ? "100" : index === 1 ? "250" : "400"}
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#d8b26f] text-lg font-semibold text-[#d8b26f]">
                  0{index + 1}
                </div>
                <h3 className={`${headingFont.className} mt-5 text-3xl text-[#f7e9cc] sm:text-4xl`}>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#b9c1d4]">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="bg-[#0a0f1b] px-5 py-14 sm:px-6 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">
                Inside the Platform
              </p>
              <h2 className={`${headingFont.className} mt-4 text-4xl text-[#f6e7c8] sm:text-5xl md:text-6xl`}>
                Inside the SuperDon Elite Platform
              </h2>
              <p className="mt-4 max-w-xl text-sm text-[#b9c1d4] md:text-base">
                A glassmorphism interface built for premium operations: guest lists, live check-ins, and
                real-time event insights in one serene workspace.
              </p>
              <div className="mt-8 grid gap-4">
                <div
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                  data-aos="zoom-in"
                  data-aos-duration="900"
                >
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
                <div
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  data-aos="zoom-in"
                  data-aos-duration="900"
                >
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
              <div
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                data-aos="zoom-in"
                data-aos-duration="900"
              >
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
              <div
                className="rounded-3xl border border-white/10 bg-[#101827] p-6"
                data-aos="zoom-in"
                data-aos-duration="900"
              >
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
          data-aos="fade-right"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(9,8,20,0.76), rgba(78,34,98,0.38)), url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div
          className="grid min-h-[50vh] content-center bg-[#130f1f] px-6 py-12 text-white sm:px-8 md:min-h-screen md:px-12 md:py-14"
          data-aos="fade-left"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">Value</p>
          <h2 className={`${headingFont.className} mt-4 text-4xl text-[#f6e7c8] sm:text-5xl md:text-6xl`}>
            Why Premium Hosts Choose Us
          </h2>
          <ul className="mt-6 space-y-4 text-sm text-[#d6d8e4] sm:text-base">
            {premiumPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
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

      <section id="audience" className="bg-[#0b0f1a] px-5 py-14 sm:px-6 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">Designed for</p>
          <h2 className={`${headingFont.className} mt-4 text-4xl text-[#f6e7c8] sm:text-5xl md:text-6xl`}>
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
        className="relative grid min-h-screen items-center overflow-hidden bg-[#050812] px-5 py-14 sm:px-6 md:px-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(41,56,114,0.4),transparent_45%),radial-gradient(circle_at_70%_75%,rgba(82,42,116,0.22),transparent_45%)]" />
        <div
          className="relative mx-auto w-full max-w-4xl rounded-[28px] border border-[#2e3448] bg-[#0a1020]/88 px-5 py-9 shadow-[0_26px_60px_rgba(0,0,0,0.5)] sm:px-6 md:px-10 md:py-12"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <h2 className={`${headingFont.className} text-center text-4xl text-[#e2c48e] sm:text-5xl md:text-6xl`}>
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
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 text-xs text-[#b0b8cd] sm:flex-row sm:items-center sm:px-6 md:px-10">
          <div>
            <p className={`${headingFont.className} text-2xl text-[#f6e7c8]`}>SuperDon Elite</p>
            <p className="mt-2 max-w-xs text-xs text-[#9aa4b8]">
              SuperDon Elite - Elevating events since 2024.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
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
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1877F2] text-[10px] shadow-[0_10px_20px_rgba(24,119,242,0.35)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-white"
              >
                <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.07 4.39 23.06 10.12 24v-8.43H7.08v-3.5h3.04V9.41c0-3.04 1.79-4.72 4.54-4.72 1.31 0 2.68.24 2.68.24v2.96h-1.5c-1.48 0-1.94.93-1.94 1.88v2.25h3.3l-.53 3.5h-2.77V24C19.61 23.06 24 18.07 24 12.07z" />
              </svg>
            </span>
            <span
              className="grid h-8 w-8 place-items-center rounded-full text-[10px] shadow-[0_10px_20px_rgba(214,41,118,0.35)]"
              style={{
                background:
                  "linear-gradient(135deg, #feda75 0%, #d62976 45%, #962fbf 70%, #4f5bd5 100%)",
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-none stroke-white"
                strokeWidth="1.7"
              >
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17" cy="7" r="1" className="fill-white stroke-none" />
              </svg>
            </span>
            <span
              className="relative grid h-8 w-8 place-items-center rounded-full text-[10px] shadow-[0_10px_20px_rgba(238,29,82,0.28)]"
              style={{
                background:
                  "linear-gradient(135deg, #69C9D0 0%, #010101 55%, #EE1D52 100%)",
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-white"
              >
                <path d="M21.6 7.2c-1.05.45-2.18.75-3.36.9-.32-.32-.76-.52-1.26-.52a2.7 2.7 0 0 0-2.7 2.7v4.52a6.83 6.83 0 1 1-5.93-6.77v2.39a4.5 4.5 0 1 0 3.83 4.43V2.4h2.4c.02.69.2 1.36.54 1.95.66 1.15 1.82 1.93 3.14 2.1v.75c1.21 0 2.37-.24 3.44-.7v1.7z" />
              </svg>
            </span>
          </div>
          <p>Copyright 2026 SuperDon Elite Events. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
