"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sileo } from "sileo";

type LogoutButtonProps = {
  className?: string;
  containerClassName?: string;
  errorClassName?: string;
  redirectTo?: string;
};

export function LogoutButton({
  className,
  containerClassName,
  errorClassName,
  redirectTo,
}: LogoutButtonProps = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onLogout() {
    const shouldLogout = await new Promise<boolean>((resolve) => {
      let resolved = false;
      const id = sileo.action({
        title: "Log out?",
        description: "You will need to sign in again to access your account.",
        duration: 8000,
        button: {
          title: "Yes, log out",
          onClick: () => {
            resolved = true;
            sileo.dismiss(id);
            resolve(true);
          },
        },
      });

      setTimeout(() => {
        if (!resolved) resolve(false);
      }, 8200);
    });

    if (!shouldLogout) return;

    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      setError("Logout failed");
      sileo.error({
        title: "Logout failed",
        description: "Please try again.",
      });
      setLoading(false);
      return;
    }

    sileo.success({
      title: "Logged out",
      description: "See you again soon.",
    });

    router.push(redirectTo ?? "/");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className={containerClassName ?? "flex flex-col items-end gap-1"}>
      <button
        type="button"
        onClick={onLogout}
        disabled={loading}
        className={
          className ??
          "rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 disabled:opacity-60"
        }
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
      {error ? <p className={errorClassName ?? "text-xs text-red-600"}>{error}</p> : null}
    </div>
  );
}
