import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { Playfair_Display, Manrope } from "next/font/google";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <main
      className={`${bodyFont.className} min-h-screen px-4 py-8 text-white md:px-10`}
      style={{
        background:
          "radial-gradient(circle at 15% 10%, #2a874f 0%, #15492f 35%, #0a2116 100%)",
      }}
    >
      <div className="mx-auto grid min-h-[82vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-md md:grid-cols-[1fr_1.15fr]">
        <section className="relative flex flex-col justify-between overflow-hidden p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 10% 20%, #4ddb7f 0%, transparent 40%), radial-gradient(circle at 90% 80%, #1d6e45 0%, transparent 45%)",
            }}
          />
          <div className="relative mt-auto max-w-sm">
            <h1 className={`${headingFont.className} text-4xl font-semibold md:text-5xl`}>
              Event Management System
            </h1>
            <p className="mt-4 text-sm leading-7 text-emerald-100/85">
              Create events, manage capacity, handle registrations, and check in attendees from one
              organizer workflow.
            </p>
          </div>
          <p className="relative mt-10 text-xs uppercase tracking-[0.22em] text-emerald-200/75">
            Superflex Demo
          </p>
        </section>

        <section className="border-l border-white/15 bg-black/30 px-7 py-8 md:px-12 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className={`${headingFont.className} text-4xl font-semibold`}>
                {user ? "Welcome back" : "Get started"}
              </h2>
              <p className="mt-3 text-sm text-zinc-200">
                {user
                  ? `Signed in as ${user.name} (${user.email})`
                  : "Sign up or login to continue."}
              </p>
            </div>
            {user ? <LogoutButton /> : null}
          </div>

          {user ? (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-zinc-200">Role: {user.role}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Link
                  href="/events/new"
                  className="rounded bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-400"
                >
                  Create Event
                </Link>
                <Link
                  href="/"
                  className="rounded border border-white/40 px-4 py-3 text-center text-sm font-semibold"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <Link
                href="/signup"
                className="rounded bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-400"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="rounded border border-white/40 px-4 py-3 text-center text-sm font-semibold"
              >
                Login
              </Link>
            </div>
          )}

          <div className="mt-10 border-t border-white/20 pt-6 text-xs text-zinc-300">
            <p>Auth and session foundation complete. Next: event CRUD and registration flows.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
