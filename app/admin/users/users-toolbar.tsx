"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UsersToolbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setError("");
  };

  const openModal = () => {
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setError("");
    setIsOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Unable to create organizer.");
        return;
      }

      closeModal();
      router.refresh();
    } catch {
      setError("Unable to create organizer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="organizer-top-shadow flex h-10 w-full max-w-[320px] items-center gap-2 rounded-xl border border-transparent bg-white px-3 shadow-sm">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4 text-[#8b93ad]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            placeholder="Search users"
            className="h-full w-full bg-transparent text-sm text-[#1a1f35] outline-none placeholder:text-[#9aa2b6]"
          />
        </div>
        <button
          type="button"
          onClick={openModal}
          className="organizer-top-shadow inline-flex h-10 items-center justify-center rounded-xl bg-[#3b5dd0] px-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#3352c5]"
        >
          + Add Organizer
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1023]/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b7593]">New Organizer</p>
              <h2 className="text-2xl font-semibold text-[#1b2441]">Add Organizer</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-[#4a5b87]">
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, name: event.target.value }));
                    setError("");
                  }}
                  className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                  placeholder="Organizer name"
                />
              </label>
              <label className="block text-sm text-[#4a5b87]">
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, email: event.target.value }));
                    setError("");
                  }}
                  className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                  placeholder="organizer@email.com"
                />
              </label>
              <label className="block text-sm text-[#4a5b87]">
                Password
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={(event) => {
                      setForm((prev) => ({ ...prev, password: event.target.value }));
                      setError("");
                    }}
                    minLength={8}
                    className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 pr-12 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa2b6] transition hover:text-[#3b5dd0]"
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
              </label>
              <label className="block text-sm text-[#4a5b87]">
                Confirm password
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(event) => {
                      setForm((prev) => ({ ...prev, confirmPassword: event.target.value }));
                      setError("");
                    }}
                    minLength={8}
                    className="mt-2 h-11 w-full rounded-xl border border-[#e3e7f3] bg-white px-3 pr-12 text-sm text-[#1b2441] outline-none focus:border-[#3b5dd0]"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa2b6] transition hover:text-[#3b5dd0]"
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
              </label>
              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 rounded-xl border border-[#d9dff0] px-4 text-sm font-semibold text-[#4a5b87] transition hover:bg-[#f3f5fb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-[#3b5dd0] px-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#3352c5] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Create Organizer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
