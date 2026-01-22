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

export default async function Home() {
  const user = await getCurrentUser();
  if (user?.role === "ADMIN") redirect("/admin");

  const navActions = (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-full border border-white/80 px-4 py-1 text-xs font-extrabold tracking-wide text-white transition hover:bg-white hover:text-black"
      >
        LOGIN
      </Link>
      <Link
        href="/signup"
        className="rounded-full border border-white/80 bg-white/20 px-4 py-1 text-xs font-extrabold tracking-wide text-white transition hover:bg-white hover:text-black"
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
            "linear-gradient(120deg, rgba(9,11,17,0.8) 0%, rgba(16,22,36,0.78) 42%, rgba(46,18,52,0.74) 100%), url('https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&w=2200&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,168,92,0.25),transparent_40%),radial-gradient(circle_at_85%_70%,rgba(168,104,207,0.22),transparent_42%)]" />

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
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/70 text-xs">
                  f
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/70 text-xs">
                  t
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/70 text-xs">
                  g+
                </span>
              </div>
            </div>
          </header>

          <nav className="mt-6 flex justify-end gap-7 text-sm">
            <a href="#home" className="hover:underline">
              Home
            </a>
            <a href="#how" className="hover:underline">
              How It Works
            </a>
            <a href="#value" className="hover:underline">
              Value
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </nav>

          <div className="mx-auto mt-28 max-w-4xl text-center md:mt-36">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d8b26f]">Curated Events</p>
            <h1 className={`${headingFont.className} mt-5 text-6xl leading-[0.95] md:text-8xl`}>
              A Premium Way To Host And Celebrate
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-[#f5efe4]/90 md:text-2xl">
              Crafted experiences, modern event operations, and zero chaos from invitation to
              check-in.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={user ? "/events/new" : "/signup"}
                className="rounded-full bg-[#d8b26f] px-9 py-3 text-sm font-bold tracking-[0.12em] text-[#151515] transition hover:bg-[#e6c48a]"
              >
                {user ? "CREATE EVENT" : "START NOW"}
              </Link>
              <Link
                href={user ? "/" : "/login"}
                className="rounded-full border border-[#ead8b4] bg-black/35 px-9 py-3 text-sm font-bold tracking-[0.12em] text-[#f8efde] transition hover:bg-black/50"
              >
                {user ? "BROWSE EVENTS" : "EXPLORE"}
              </Link>
            </div>
          </div>

          <div className="mt-20 flex justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f5e5bf]" />
            <span className="h-2 w-2 rounded-full bg-[#f5e5bf]/70" />
            <span className="h-2 w-2 rounded-full bg-[#f5e5bf]/45" />
          </div>
        </div>
      </section>

      <section id="how" className="grid min-h-screen items-center bg-[#0d111d] px-6 py-16 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className={`${headingFont.className} text-center text-6xl text-[#f6e7c8]`}>
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#b8bfd3] md:text-base">
            Designed for premium events where details, timing, and attendee flow matter.
          </p>
          <div className="mt-12 grid gap-8 text-center md:grid-cols-3">
            <article className="rounded-3xl border border-[#2a3248] bg-[#12192a] px-6 py-9 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d8b26f] text-2xl font-bold text-[#0f1220]">
                +
              </div>
              <h3 className={`${headingFont.className} mt-5 text-4xl text-[#f7e9cc]`}>Post</h3>
              <p className="mt-2 text-sm text-[#b9c1d4]">
                Add title, schedule, venue or online link, and banner image in one organizer form.
              </p>
            </article>
            <article className="rounded-3xl border border-[#2a3248] bg-[#12192a] px-6 py-9 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d8b26f] text-2xl font-bold text-[#0f1220]">
                #
              </div>
              <h3 className={`${headingFont.className} mt-5 text-4xl text-[#f7e9cc]`}>Invite</h3>
              <p className="mt-2 text-sm text-[#b9c1d4]">
                Share event pages publicly so users can browse details and register immediately.
              </p>
            </article>
            <article className="rounded-3xl border border-[#2a3248] bg-[#12192a] px-6 py-9 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d8b26f] text-2xl font-bold text-[#0f1220]">
                $
              </div>
              <h3 className={`${headingFont.className} mt-5 text-4xl text-[#f7e9cc]`}>Manage</h3>
              <p className="mt-2 text-sm text-[#b9c1d4]">
                Automatic capacity checks prevent overbooking and show live remaining seats.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="value" className="grid min-h-screen md:grid-cols-2">
        <div
          className="min-h-[50vh] md:min-h-screen"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(9,8,20,0.76), rgba(104,34,98,0.58)), url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="grid min-h-[50vh] content-center bg-[#130f1f] px-8 py-14 text-white md:min-h-screen md:px-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">Value</p>
          <h2 className={`${headingFont.className} mt-4 text-6xl text-[#f6e7c8]`}>
            Why Premium Hosts Choose Us
          </h2>
          <ul className="mt-8 space-y-4 text-base text-[#d6d8e4]">
            <li>Precise registration and live seat availability</li>
            <li>No manual reconciliation of guest lists</li>
            <li>Organizer dashboard with instant attendee insights</li>
            <li>Fast check-in workflows at venue entry</li>
          </ul>
        </div>
      </section>

      <section
        id="contact"
        className="relative grid min-h-screen items-center overflow-hidden bg-[#050812] px-6 py-16"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(41,56,114,0.42),transparent_40%),radial-gradient(circle_at_70%_75%,rgba(82,42,116,0.28),transparent_40%)]" />
        <div className="relative mx-auto w-full max-w-4xl rounded-[28px] border border-[#2e3448] bg-[#0a1020]/88 px-6 py-10 shadow-[0_26px_60px_rgba(0,0,0,0.5)] md:px-10 md:py-12">
          <h2 className={`${headingFont.className} text-center text-5xl text-[#e2c48e] md:text-6xl`}>
            Let&apos;s Get It Started
          </h2>
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
              placeholder="Password"
            />
            <div className="pt-5 text-center">
              <Link
                href={user ? "/events/new" : "/signup"}
                className="inline-flex h-12 min-w-40 items-center justify-center rounded-full bg-[linear-gradient(90deg,#ba9054_0%,#e2c48e_55%,#c89f63_100%)] px-9 text-sm font-bold tracking-[0.16em] text-[#16140f] transition hover:brightness-110"
              >
                SIGN UP
              </Link>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-[#080b14] text-white">
        <div className="grid grid-cols-2 md:grid-cols-6">
          {[
            "photo-1515169067868-5387ec356754",
            "photo-1527529482837-4698179dc6ce",
            "photo-1464366400600-7168b8af9bc3",
            "photo-1470229722913-7c0e2dbbafd3",
            "photo-1496843916299-590492c751f4",
            "photo-1516450360452-9312f5e86fc7",
          ].map((id) => (
            <div
              key={id}
              className="h-28 md:h-36"
              style={{
                backgroundImage: `url('https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80')`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          ))}
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-[#b0b8cd] md:px-10">
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#f6e7c8]">
              Site Map
            </a>
            <a href="#" className="hover:text-[#f6e7c8]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#f6e7c8]">
              Terms of Service
            </a>
          </div>
          <p>Copyright 2026 SuperDon Elite Events. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
