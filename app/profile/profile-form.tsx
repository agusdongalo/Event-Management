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
