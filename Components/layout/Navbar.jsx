"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Navbar({ variant = "default", activeTab = "Home" }) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const { isGuest, logout } = useAuth();

  const Logo = () => (
    <div
      onClick={() => router.push("/home")}
      className="cursor-pointer font-['Syne'] text-[1.4rem] font-extrabold tracking-tight text-[#e8820c]"
    >
      Crew<span className="text-white">Sync</span>
    </div>
  );

  /* ── AUTH variant ── */
  if (variant === "auth") {
    return (
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-['DM_Sans']">
        <Logo />
        <div className="flex items-center text-[0.85rem] text-white/60">
          New to CrewSync?&nbsp;
          <button
            onClick={() => router.push("/register")}
            className="cursor-pointer border-none bg-transparent p-0 text-[0.85rem] font-semibold text-[#e8820c] transition-opacity hover:opacity-80"
          >
            Get Started
          </button>
        </div>
      </nav>
    );
  }

  /* ── REGISTER variant ── */
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

  /* ── PROPERTY OWNER DASHBOARD variant ── */
  if (variant === "propertyOwnerDashboard") {
    return (
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-['DM_Sans']">
        <Logo />
        <div className="hidden items-center gap-1 sm:flex">
          <button
            onClick={() => router.push("/home")}
            className="rounded-md px-3 py-1.5 text-[0.8rem] font-medium text-white/55 transition-all hover:bg-white/10 hover:text-white"
          >
            Home
          </button>
          <button
            onClick={() => {
              if (isGuest) {
                router.push("/dashboard/propertyowner/timeline");
              } else {
                router.push("/dashboard/propertyowner");
              }
            }}
            className="rounded-md bg-white/10 px-3 py-1.5 text-[0.8rem] font-medium text-[#e8820c] transition-all"
          >
            {isGuest ? "Guest Property Owner Dashboard" : "Property Owner Dashboard"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isGuest ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="hidden rounded-md border border-white/30 bg-transparent px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-white/10 sm:block"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/register")}
                className="rounded-md bg-[#e8820c] px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-[#b85a00]"
              >
                Get Started
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                router.push("/home");
              }}
              className="rounded-md bg-[#e8820c] px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-[#b85a00] cursor-pointer"
            >
              Log Out
            </button>
          )}
        </div>
      </nav>
    );
  }

  /* ── PROJECT FORM variant ── */
  if (variant === "projectForm") {
    return (
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-['DM_Sans'] border-b border-white/[0.06]">
        <div
          onClick={() => router.push("/home")}
          className="cursor-pointer font-['Syne'] text-[1.4rem] font-extrabold tracking-tight text-[#e8820c]"
        >
          Create <span className="text-white">Project</span>
        </div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-[6px] text-white/50 text-[0.82rem] font-medium hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none font-['DM_Sans']"
        >
          ← Back
        </button>
      </nav>
    );
  }

  /* ── DEFAULT variant ── */
  // Dynamically attach the accurate dashboard path into your primary tabs array
  const tabs = [
    { label: "Home", href: "/home" },
  ];

  return (
    <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-['DM_Sans'] relative">
      <Logo />

      <div className="hidden items-center gap-1 sm:flex absolute left-1/2 -translate-x-1/2">
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
        {isGuest ? (
          <>
            <button
              onClick={() => router.push("/login")}
              className="hidden rounded-md border border-white/30 bg-transparent px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-white/10 sm:block"
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/register")}
              className="rounded-md bg-[#e8820c] px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-[#b85a00]"
            >
              Get Started
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              logout();
              router.push("/home");
            }}
            className="rounded-md bg-[#e8820c] px-3.5 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-[#b85a00] cursor-pointer"
          >
            Log Out
          </button>
        )}
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