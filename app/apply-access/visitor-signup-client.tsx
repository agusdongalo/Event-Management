"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  headingClassName: string;
};

export default function VisitorSignupClient({ headingClassName }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const payload = {
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        setLoading(false);
        return;
      }

      router.push("/attendee");
      router.refresh();
    } catch {
      setError("Unable to create account.");
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <h2 className={`${headingClassName} text-4xl font-semibold`}>
        Create your visitor profile
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="First name"
          className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
          required
        />
        <input
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Last name"
          className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
          required
        />
      </div>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
        required
      />
      <input
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="City or area (optional)"
        className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
      />
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="Phone number (optional)"
        className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Create password"
        className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
        minLength={8}
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Repeat password"
        className="w-full border-b border-white/35 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#b9c1d4]"
        minLength={8}
        required
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        className="w-full rounded-full bg-[linear-gradient(90deg,#ba9054_0%,#e2c48e_55%,#c89f63_100%)] px-4 py-3 text-sm font-semibold text-[#151515] shadow-[0_12px_30px_rgba(216,178,111,0.35)] transition hover:brightness-110 disabled:opacity-70"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#d8caa7]/60">
        Visitor access
      </p>
    </form>
  );
}
