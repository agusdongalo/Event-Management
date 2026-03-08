"use client";

import Link from "next/link";
import { useState } from "react";

const heroNavLinks = [
  { href: "#home", label: "Home" },
  { href: "#experience", label: "The Experience" },
  { href: "#preview", label: "Platform" },
  { href: "#host-access", label: "Access" },
];

type HomeHeroHeaderProps = {
  brandClassName: string;
};

export function HomeHeroHeader({ brandClassName }: HomeHeroHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((current) => !current);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 bg-[#090b11]/50 px-5 py-3 backdrop-blur-md sm:hidden">
        <header className="flex items-center justify-between gap-3 py-1">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d8b26f] bg-black/40 text-xs tracking-[0.25em] text-[#d8b26f]">
              SE
            </div>
            <p className={`${brandClassName} text-[1.75rem] leading-none tracking-wide text-[#f6e7c8]`}>
              SuperDon Elite
            </p>
          </div>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="hero-mobile-nav"
            onClick={toggleMenu}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/35 text-white transition hover:bg-white/10"
          >
            <span className="sr-only">
              {isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {isMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </header>
      </div>

      <div className="hidden sm:block">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d8b26f] bg-black/40 text-xs tracking-[0.25em] text-[#d8b26f]">
              SE
            </div>
            <p className={`${brandClassName} text-2xl tracking-wide text-[#f6e7c8] sm:text-4xl`}>
              SuperDon Elite
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-8 sm:w-auto sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-white/70 px-4 py-1 text-xs font-extrabold tracking-wide text-white transition hover:bg-white hover:text-black"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-[#ead8b4] bg-[#d8b26f] px-4 py-1 text-xs font-extrabold tracking-wide text-[#151515] transition hover:brightness-110"
              >
                SIGN UP
              </Link>
            </div>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/80 sm:justify-end sm:gap-6">
          {heroNavLinks.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-30 bg-black/12 sm:hidden" onClick={closeMenu}>
          <div className="px-5 pt-[5.5rem]">
            <nav
              id="hero-mobile-nav"
              onClick={(event) => event.stopPropagation()}
              className="grid gap-2 rounded-[24px] border border-white/10 bg-[#050812]/46 p-3 text-center text-xs font-semibold tracking-[0.14em] text-white/90 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              {heroNavLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-3 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-1 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-3 text-[11px] font-extrabold tracking-wide text-white transition hover:bg-white hover:text-black"
                >
                  LOGIN
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="rounded-full border border-[#ead8b4] bg-[#d8b26f] px-3 py-3 text-[11px] font-extrabold tracking-wide text-[#151515] transition hover:brightness-110"
                >
                  SIGN UP
                </Link>
              </div>
            </nav>
          </div>
        </div>
      ) : null}

      <div aria-hidden="true" className="h-[4.75rem] sm:hidden" />
    </>
  );
}
