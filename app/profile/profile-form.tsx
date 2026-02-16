"use client";

import { FormEvent, useState } from "react";

type Props = {
  initialName: string;
  initialEmail: string;
};

export default function ProfileForm({ initialName, initialEmail }: Props) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setError("Current password is required to change your password.");
        setLoading(false);
        return;
      }
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to update profile.");
        setLoading(false);
        return;
      }

      setMessage(data.message ?? "Profile updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Unable to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="rounded-2xl border border-[#27314b] bg-[#0f141f] p-4">
        <div className="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex flex-col items-start gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full border border-[#ead8b4] bg-[#151b2c] text-sm font-semibold text-[#f6e7c8]">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#2a3248] bg-[#0f141f] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#d8b26f] transition hover:border-[#d8b26f]/60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              Change photo
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-start sm:justify-end">
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              className="text-xs text-[#b9c1d4] file:mr-3 file:rounded-full file:border-0 file:bg-[#1a2236] file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.2em] file:text-[#f6e7c8]"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Full name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm text-[#f3eee6] outline-none focus:border-[#d7b276]"
          placeholder="Your name"
          required
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[#27314b] bg-[#0f141f] px-4 py-3 text-sm text-[#f3eee6] outline-none focus:border-[#d7b276]"
          placeholder="you@email.com"
          required
        />
      </div>
      <div className="rounded-2xl border border-[#27314b] bg-[#0f141f] p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b8bfd3]">Change password</p>
        <div className="mt-3 grid gap-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-lg border border-[#27314b] bg-transparent px-3 py-2 text-sm text-[#f3eee6] outline-none focus:border-[#d7b276]"
            placeholder="Current password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-lg border border-[#27314b] bg-transparent px-3 py-2 text-sm text-[#f3eee6] outline-none focus:border-[#d7b276]"
            placeholder="New password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-[#27314b] bg-transparent px-3 py-2 text-sm text-[#f3eee6] outline-none focus:border-[#d7b276]"
            placeholder="Repeat new password"
          />
        </div>
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-200">{message}</p> : null}
      <button
        type="submit"
        className="w-full rounded-full bg-[linear-gradient(90deg,#ba9054_0%,#e2c48e_55%,#c89f63_100%)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#16140f] transition hover:brightness-110 disabled:opacity-70"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
