"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * CrewSync — Navbar (Tailwind CSS)
 *
 * Props:
 *   variant   "default" | "auth" | "register"
 *             "default"  → logo · Home tab · Log In · Get Started       (home page)
 *             "auth"     → logo · "New to CrewSync? Get Started"         (login page)
 *             "register" → logo · "Already have an account?" · Sign In   (register page)
 *
 *   activeTab  Highlights the matching tab. Defaults to "Home". (default variant only)
 *
 * Usage:
 *   <Navbar />                    ← home / main pages
 *   <Navbar variant="auth" />     ← login page
 *   <Navbar variant="register" /> ← register page
 */
export default function Navbar({ variant = "default", activeTab = "Home" }) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  /* ── Shared: Logo ── */
  const Logo = () => (
    <div
      onClick={() => router.push("/")}
      className="cursor-pointer font-['Syne'] text-[1.4rem] font-extrabold tracking-tight text-[#e8820c]"
    >
      Crew<span className="text-white">Sync</span>
    </div>
  );

  /* ── AUTH variant (login page) ── */
  if (variant === "auth") {
    return (
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-['DM_Sans']">
        <Logo />
        <div className="flex items-center text-[0.85rem] text-white/60">
          New to CrewSync?&nbsp;
          <button
            onClick={() => router.push("/get-started")}
            className="cursor-pointer border-none bg-transparent p-0 text-[0.85rem] font-semibold text-[#e8820c] transition-opacity hover:opacity-80"
          >
            Get Started
          </button>
        </div>
      </nav>
    );
  }

  /* ── REGISTER variant (register page) ── */
  if (variant === "register") {
    return (
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-['DM_Sans']">
        <Logo />
        <div className="flex items-center gap-2.5">
          <span className="text-[0.82rem] text-white/55">Already have an account?</span>
          <button
            onClick={() => router.push("/login")}
            className="rounded-md border border-white/30 bg-transparent px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-white/10"
          >
            Log In
          </button>
        </div>
      </nav>
    );
  }

  /* ── DEFAULT variant (home + other main pages) ── */
  const tabs = [
    { label: "Home", href: "/" },
  ];

  return (
    <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-['DM_Sans']">
      <Logo />

      <div className="hidden items-center gap-1 sm:flex">
        {tabs.map(({ label, href }) => {
          const isActive = activeTab === label;
          return (
            <button
              key={label}
              onClick={() => router.push(href)}
              className={`rounded-md px-3 py-1.5 text-[0.8rem] font-medium transition-all
                ${isActive
                  ? "bg-white/10 text-[#e8820c]"
                  : "bg-transparent text-white/55 hover:bg-white/10 hover:text-white"
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/login")}
          className="hidden rounded-md border border-white/30 bg-transparent px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-white/10 sm:block"
        >
          Log In
        </button>
        <button
          onClick={() => router.push("/get-started")}
          className="rounded-md bg-[#e8820c] px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-[#b85a00]"
        >
          Get Started
        </button>
        <button
          onClick={() => setNavOpen((v) => !v)}
          className="border-none bg-transparent text-[1.3rem] text-white sm:hidden"
        >
          ☰
        </button>
      </div>

      {navOpen && (
        <div className="absolute left-0 right-0 top-[60px] z-[200] flex flex-col border-b border-white/10 bg-[#2e3340] p-2 sm:hidden">
          {tabs.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => { router.push(href); setNavOpen(false); }}
              className={`w-full rounded-md px-3.5 py-2.5 text-left text-[0.8rem] font-medium transition-all
                ${activeTab === label
                  ? "bg-white/10 text-[#e8820c]"
                  : "bg-transparent text-white/55 hover:bg-white/10 hover:text-white"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}