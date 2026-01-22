"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

type AttendeeUserMenuProps = {
  name: string;
  email: string;
};

export function AttendeeUserMenu({ name, email }: AttendeeUserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-3 rounded-full border border-[#2a3248] bg-[#12192a] px-4 py-2 text-left transition hover:border-[#3b4662]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#d8b26f] text-sm font-semibold text-[#151515]">
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div className="pr-2">
          <p className="text-sm font-semibold text-[#f3eee6]">{name}</p>
          <p className="text-xs text-[#9aa4b8]">{email}</p>
        </div>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-48 rounded-2xl border border-[#2a3248] bg-[#0f141f] p-2 shadow-[0_22px_40px_rgba(0,0,0,0.45)]"
        >
          <Link
            href="/attendee"
            className="block rounded-xl px-3 py-2 text-sm text-[#f3eee6] hover:bg-[#161d2b]"
          >
            My Account
          </Link>
          <Link
            href="/settings"
            className="block rounded-xl px-3 py-2 text-sm text-[#f3eee6] hover:bg-[#161d2b]"
          >
            Settings
          </Link>
          <div className="px-1 pt-1">
            <LogoutButton
              containerClassName="flex flex-col items-stretch gap-1"
              className="w-full rounded-xl border border-[#2a3248] bg-[#151b28] px-3 py-2 text-sm text-[#f3eee6] hover:bg-[#1c2536]"
              errorClassName="text-[11px] text-rose-200"
              redirectTo="/"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
