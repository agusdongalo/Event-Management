"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "organizer-theme";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.organizerTheme = theme;
  document.body.dataset.organizerTheme = theme;
  document.body.classList.toggle("organizer-dark", theme === "dark");
}

export function ThemeToggleButton() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme: ThemeMode = stored ?? (prefersDark ? "dark" : "light");
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="grid h-10 w-10 place-items-center rounded-full border border-white bg-white text-[#51607f] shadow-sm"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.5A9 9 0 1111.5 3a7 7 0 109.5 9.5z" />
        <text x="11.5" y="14" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">
          C
        </text>
      </svg>
    </button>
  );
}
