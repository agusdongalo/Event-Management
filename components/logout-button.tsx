"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

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
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onLogout() {
    const isOrganizerRoute = pathname?.startsWith("/organizer");
    const isOrganizerDark = typeof document !== "undefined" && document.body.classList.contains("organizer-dark");
    const isLightTheme = isOrganizerRoute && !isOrganizerDark;

    const theme = isLightTheme
      ? {
          background: "#f5f7ff",
          color: "#0d1021",
          confirmButtonColor: "#2f5bff",
          cancelButtonColor: "#94a3c8",
        }
      : {
          background: "#0a1020",
          color: "#f6e7c8",
          confirmButtonColor: "#d8b26f",
          cancelButtonColor: "#2a3248",
        };

    const result = await Swal.fire({
      title: "Log out?",
      text: "You will need to sign in again to access your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: theme.confirmButtonColor,
      cancelButtonColor: theme.cancelButtonColor,
      background: theme.background,
      color: theme.color,
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      setError("Logout failed");
      await Swal.fire({
        title: "Logout failed",
        text: "Please try again.",
        icon: "error",
        confirmButtonColor: theme.confirmButtonColor,
        background: theme.background,
        color: theme.color,
      });
      setLoading(false);
      return;
    }

    await Swal.fire({
      title: "Logged out",
      text: "See you again soon.",
      icon: "success",
      timer: 1400,
      showConfirmButton: false,
      background: theme.background,
      color: theme.color,
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
