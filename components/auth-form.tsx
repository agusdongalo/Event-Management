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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const data = (await response.json()) as {
      error?: string;
      user?: { role?: "ADMIN" | "ORGANIZER" | "USER" };
    };
    if (!response.ok) {
      setError(data.error ?? "Authentication failed.");
      setLoading(false);
      return;
    }

    const targetPath =
      data.user?.role === "ADMIN"
        ? "/admin"
        : data.user?.role === "ORGANIZER"
          ? "/organizer"
          : "/attendee";
    router.push(targetPath);
    router.refresh();
  }

  return (
    <main
      className={`${bodyFont.className} min-h-screen px-4 py-8 text-white md:px-10`}
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(216,178,111,0.22), transparent 40%), radial-gradient(circle at 80% 30%, rgba(92,88,126,0.24), transparent 45%), #090b11",
      }}
    >
      <div className="mx-auto grid min-h-[76vh] w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-black/55 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-md md:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex flex-col justify-between overflow-hidden p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(216,178,111,0.28), transparent 42%), radial-gradient(circle at 85% 70%, rgba(92,88,126,0.26), transparent 45%)",
            }}
          />
          <div className="relative max-w-lg space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#d8b26f]">
                SuperDon Elite
              </p>
              <h1 className={`${headingFont.className} mt-4 text-4xl font-semibold md:text-5xl`}>
                Join The Elite Circle
              </h1>
              <p className="mt-4 text-sm leading-7 text-[#e8dfcf]/80">
                Access the industry&apos;s premium platform for effortless event orchestration and
                seamless attendee management.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-[#d6d8e4]">
              {[
                "Curate & manage upscale events",
                "Track guest lists in real-time",
                "Streamline check-ins for VIPs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-[#d8b26f] text-[10px] text-[#d8b26f]">
                    OK
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Approval rate", value: "98%" },
                { label: "Avg check-in", value: "4.7s" },
                { label: "VIP events", value: "320+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#c7cfdf]">
                    {stat.label}
                  </p>
                  <p className={`${headingFont.className} mt-2 text-2xl text-[#f6e7c8]`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="relative mt-10 text-xs uppercase tracking-[0.3em] text-[#d8caa7]/70">
            Event Management Platform
          </p>
        </section>

        <section className="flex flex-col bg-black/40 px-7 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6">
            <form
              onSubmit={onSubmit}
              className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            >
              <h2 className={`${headingFont.className} text-4xl font-semibold`}>
                {mode === "login" ? "Sign In" : "Sign Up"}
              </h2>
              {mode === "signup" ? (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
                  required
                />
              ) : null}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={mode === "login" ? "Your password" : "Create password"}
                  className="w-full border-b border-white/35 bg-transparent py-2 pr-16 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#d8caa7]/70 transition hover:text-[#f6e7c8] focus:outline-none focus-visible:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    {showPassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.5 5.2A10.7 10.7 0 0 1 12 5c5.3 0 9.1 4.4 10 7-0.34 1-1.2 2.7-2.7 4.2" />
                        <path d="M6.2 6.2C4 7.8 2.6 10 2 12c0.5 1.6 2.1 4.6 5.4 6.2A10.8 10.8 0 0 0 12 19c1.3 0 2.6-0.2 3.8-0.7" />
                      </>
                    ) : (
                      <>
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3.2" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {mode === "signup" ? (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat password"
                    className="w-full border-b border-white/35 bg-transparent py-2 pr-16 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#d8caa7]/70 transition hover:text-[#f6e7c8] focus:outline-none focus-visible:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      {showConfirmPassword ? (
                        <>
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.5 5.2A10.7 10.7 0 0 1 12 5c5.3 0 9.1 4.4 10 7-0.34 1-1.2 2.7-2.7 4.2" />
                          <path d="M6.2 6.2C4 7.8 2.6 10 2 12c0.5 1.6 2.1 4.6 5.4 6.2A10.8 10.8 0 0 0 12 19c1.3 0 2.6-0.2 3.8-0.7" />
                        </>
                      ) : (
                        <>
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3.2" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              ) : null}
              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              <button
                type="submit"
                className="w-full rounded-full bg-[linear-gradient(90deg,#ba9054_0%,#e2c48e_55%,#c89f63_100%)] px-4 py-3 text-sm font-semibold text-[#151515] shadow-[0_12px_30px_rgba(216,178,111,0.35)] transition hover:brightness-110 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
              </button>
              {mode === "signup" ? (
                <p className="text-xs text-[#cbd2e7]">
                  Already a member?{" "}
                  <Link href="/login" className="font-semibold text-[#e2c48e]">
                    Sign in
                  </Link>
                </p>
              ) : null}
              {mode === "signup" ? (
                <Link
                  href="/apply-access"
                  className="text-[11px] uppercase tracking-[0.28em] text-[#d8caa7]/60 transition hover:text-[#f6e7c8]"
                >
                  SIGN UP AS VISITOR
                </Link>
              ) : null}
            </form>

          </div>
          <div className="mt-auto flex justify-end pt-6">
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
