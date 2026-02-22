"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialName: string;
  initialEmail: string;
  initialAvatarUrl?: string | null;
  onSaved?: () => void;
};

export default function ProfileForm({
  initialName,
  initialEmail,
  initialAvatarUrl,
  onSaved,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatarUrl ?? "");

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (!file) {
      setAvatarPreview(initialAvatarUrl ?? "");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  }

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
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      if (currentPassword) formData.set("currentPassword", currentPassword);
      if (newPassword) formData.set("newPassword", newPassword);
      if (avatarFile) formData.set("avatar", avatarFile);

      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
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
      setAvatarFile(null);
      onSaved?.();
      router.refresh();
    } catch {
      setError("Unable to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="w-[150px] rounded-2xl border border-[#27314b] bg-[#0f141f] p-3">
        <div className="flex flex-col items-center gap-2">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-[#ead8b4] bg-[#151b2c] text-lg font-semibold text-[#f6e7c8] shadow-[0_0_28px_rgba(216,178,111,0.28)]">
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
            ) : (
              name.slice(0, 1).toUpperCase()
            )}
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleAvatarChange}
            disabled={loading}
          />
          <label
            htmlFor="avatar-upload"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#d8b26f]/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d8b26f] transition hover:border-[#d8b26f] hover:text-[#f6e7c8]"
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
          </label>
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
