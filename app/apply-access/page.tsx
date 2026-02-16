import Link from "next/link";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function ApplyAccessPage() {
  return (
    <main
      className={`${bodyFont.className} min-h-screen px-4 py-8 text-white md:px-10`}
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(216,178,111,0.2), transparent 40%), radial-gradient(circle at 80% 30%, rgba(92,88,126,0.24), transparent 45%), #090b11",
      }}
    >
      <div className="mx-auto flex min-h-[82vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-black/55 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-md lg:flex-row">
        <section className="relative flex flex-1 flex-col justify-between overflow-hidden p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(216,178,111,0.28), transparent 42%), radial-gradient(circle at 85% 70%, rgba(92,88,126,0.26), transparent 45%)",
            }}
          />
          <div className="relative max-w-md space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">
                SuperDon Events
              </p>
              <h1 className={`${headingFont.className} mt-4 text-4xl md:text-5xl`}>
                Join as a Visitor
              </h1>
              <p className="mt-4 text-sm leading-7 text-[#e8dfcf]/80">
                Create a visitor profile to reserve seats, track your requests, and get updates
                on premium experiences near you.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-[#d6d8e4]">
              {[
                "Save your spot and manage requests",
                "Get notified when seats open up",
                "Receive curated event recommendations",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-[#d8b26f] text-[10px] text-[#d8b26f]">
                    OK
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="relative mt-10 text-xs uppercase tracking-[0.3em] text-[#d8caa7]/70">
            Event Management Platform
          </p>
        </section>

        <section className="flex flex-1 flex-col border-l border-white/10 bg-black/40 px-7 py-8 md:px-12 md:py-10">
          <form className="space-y-5">
            <h2 className={`${headingFont.className} text-4xl font-semibold`}>Create your visitor profile</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                placeholder="First name"
                className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
                required
              />
              <input
                placeholder="Last name"
                className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
              required
            />
            <input
              placeholder="City or area"
              className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
              required
            />
            <input
              placeholder="Phone number (optional)"
              className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
            />
            <textarea
              placeholder="What kinds of events do you enjoy?"
              className="min-h-[120px] w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[linear-gradient(90deg,#ba9054_0%,#e2c48e_55%,#c89f63_100%)] px-4 py-3 text-sm font-semibold text-[#151515] shadow-[0_12px_30px_rgba(216,178,111,0.35)] transition hover:brightness-110"
            >
              Sign Up
            </button>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d8caa7]/60">
              Visitor access
            </p>
          </form>
          <div className="mt-auto flex justify-end">
            <Link
              href="/"
              className="inline-flex text-xs uppercase tracking-[0.3em] text-[#d8caa7]/70 transition hover:text-[#f6e7c8]"
            >
              &larr; Return to the homepage
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
