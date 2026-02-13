"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Playfair_Display, Manrope } from "next/font/google";

type Mode = "login" | "signup";

type AuthFormProps = {
  mode: Mode;
};

const headingFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const title = mode === "login" ? "Sign in" : "Sign up";
  const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const payload: Record<string, string> = { email, password };
    if (mode === "signup") {
      payload.name = name;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Authentication failed.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

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
              Let&apos;s Get Started
            </h1>
            <p className="mt-4 text-sm leading-7 text-emerald-100/85">
              Create and manage events, registrations, and check-ins with a clean workflow for
              both attendees and organizers.
            </p>
          </div>
          <p className="relative mt-10 text-xs uppercase tracking-[0.22em] text-emerald-200/75">
            Event Management Portal
          </p>
        </section>

        <section className="border-l border-white/15 bg-black/30 px-7 py-8 md:px-12 md:py-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto]">
            <form onSubmit={onSubmit} className="space-y-5">
              <h2 className={`${headingFont.className} text-4xl font-semibold`}>{title}</h2>
              {mode === "signup" ? (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full border-b border-white/45 bg-transparent py-2 text-sm outline-none placeholder:text-zinc-300"
                  required
                />
              ) : null}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                className="w-full border-b border-white/45 bg-transparent py-2 text-sm outline-none placeholder:text-zinc-300"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === "login" ? "Your password" : "Create password"}
                className="w-full border-b border-white/45 bg-transparent py-2 text-sm outline-none placeholder:text-zinc-300"
                minLength={8}
                required
              />
              {mode === "signup" ? (
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat password"
                  className="w-full border-b border-white/45 bg-transparent py-2 text-sm outline-none placeholder:text-zinc-300"
                  minLength={8}
                  required
                />
              ) : null}
              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              <button
                type="submit"
                className="w-full rounded bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Please wait..." : title}
              </button>
              <p className="text-sm text-zinc-200">
                {mode === "login" ? "No account yet?" : "Already a member?"}{" "}
                <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-emerald-300">
                  {mode === "login" ? "Sign up now" : "Sign in"}
                </Link>
              </p>
            </form>

            <div className="flex flex-col items-center justify-center gap-5 border-l border-white/20 pl-6 text-center">
              <p className="text-xs tracking-[0.2em] text-zinc-300">OR</p>
              <button
                type="button"
                className="h-10 w-10 rounded-full border border-white/45 bg-white/10 text-base font-bold"
                aria-label="Continue with Facebook"
              >
                f
              </button>
              <button
                type="button"
                className="h-10 w-10 rounded-full border border-white/45 bg-white/10 text-base font-bold"
                aria-label="Continue with Twitter"
              >
                t
              </button>
              <button
                type="button"
                className="h-10 w-10 rounded-full border border-white/45 bg-white/10 text-base font-bold"
                aria-label="Continue with Google"
              >
                G
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
