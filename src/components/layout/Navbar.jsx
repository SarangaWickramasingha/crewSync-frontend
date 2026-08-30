"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Navbar({ variant = "default", activeTab = "Home", onHamburger }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, isGuest, isOwner, isProvider, isSupplier, isAdmin, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ROLE_COLORS = {
    owner:    { color: '#16a34a', hover: '#15803d' },
    provider: { color: '#2563eb', hover: '#1d4ed8' },
    supplier: { color: '#f97316', hover: '#ea580c' },
  };

  const roleKey = isOwner ? 'owner' : isProvider ? 'provider' : isSupplier ? 'supplier' : null;
  const activeColor = roleKey ? ROLE_COLORS[roleKey].color : '#e8820c';
  const activeHover  = roleKey ? ROLE_COLORS[roleKey].hover  : '#b85a00';

  const Logo = () => (
    <div
      onClick={() => router.push("/home")}
      className="cursor-pointer font-syne text-xl font-extrabold tracking-tight select-none"
      style={{ color: '#e8820c' }}
    >
      Crew<span className="text-white">Sync</span>
    </div>
  );

  /* ── Shared profile dropdown ── */
  const ProfileDropdown = ({ dashboardRoute }) => (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setProfileOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white transition-all cursor-pointer border-2"
        style={{ backgroundColor: activeColor, borderColor: 'rgba(255,255,255,0.2)' }}
      >
        {user?.avatar || 'U'}
      </button>
      {profileOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[300] w-[200px] rounded-xl border border-white/10 bg-[#2e3340] py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="px-4 py-2.5 border-b border-white/10">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[0.65rem] text-white/40 capitalize">{user?.role?.replace('_', ' ') || 'User'}</p>
          </div>
          <button
            onClick={() => { setProfileOpen(false); router.push('/home'); }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-white/65 transition-all hover:bg-white/10 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Home
          </button>
          <button
            onClick={() => { setProfileOpen(false); router.push(dashboardRoute); }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-white/65 transition-all hover:bg-white/10 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          <div className="my-1.5 border-t border-white/10" />
          <button
            onClick={async () => {
              setProfileOpen(false);
              await logout();
              window.location.href = '/home';
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-white/65 transition-all hover:bg-white/10 hover:text-[#ef4444]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log Out
          </button>
        </div>
      )}
    </div>
  );

  /* ── Shared guest buttons ── */
  const GuestButtons = () => (
    <>
      <button
        onClick={() => router.push("/login")}
        className="hidden rounded-lg border border-white/30 bg-transparent px-3.5 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/10 sm:block"
      >
        Log In
      </button>
      <button
        onClick={() => router.push("/register")}
        className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-white transition-all"
        style={{ backgroundColor: activeColor }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = activeHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = activeColor}
      >
        Get Started
      </button>
    </>
  );

  /* ── AUTH variant ── */
  if (variant === "auth") {
    return (
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-dmSans">
        <Logo />
        <div className="flex items-center text-sm text-white/60">
          New to CrewSync?&nbsp;
          <button
            onClick={() => router.push("/register")}
            className="cursor-pointer border-none bg-transparent p-0 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: activeColor }}
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
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-dmSans">
        <Logo />
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-white/55">Already have an account?</span>
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg border border-white/30 bg-transparent px-3.5 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/10"
          >
            Log In
          </button>
        </div>
      </nav>
    );
  }

  /* ── DASHBOARD variant ── */
  if (variant === "propertyOwnerDashboard" || variant === "dashboard") {
    const dashboardRoute = isOwner
      ? "/dashboard/propertyowner"
      : isProvider
      ? "/dashboard/serviceprovider"
      : isSupplier
      ? "/dashboard/supplier"
      : isAdmin
      ? "/dashboard/admin"
      : "/dashboard/propertyowner";

    return (
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-dmSans">
        <div className="flex items-center gap-3">
          {onHamburger && (
            <button
              onClick={onHamburger}
              className="md:hidden w-9 h-9 rounded-lg text-white text-lg flex items-center justify-center shadow-md flex-shrink-0"
              style={{ backgroundColor: activeColor }}
            >
              ☰
            </button>
          )}
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          {isGuest ? <GuestButtons /> : <ProfileDropdown dashboardRoute={dashboardRoute} />}
        </div>
      </nav>
    );
  }

  /* ── PROJECT FORM variant ── */
  if (variant === "projectForm") {
    return (
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-dmSans border-b border-white/[0.06]">
        <Logo color={activeColor} />
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-white/50 text-sm font-medium hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
        >
          Back
        </button>
      </nav>
    );
  }

  /* ── DEFAULT variant ── */
  const dashboardHref = isOwner
    ? "/dashboard/propertyowner"
    : isProvider
    ? "/dashboard/serviceprovider"
    : isSupplier
    ? "/dashboard/supplier"
    : isAdmin
    ? "/dashboard/admin"
    : "/dashboard/propertyowner/timeline";

  return (
    <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between bg-[#1a1d23] px-6 font-dmSans">
      <Logo />
      <div className="flex items-center gap-2">
        {isGuest ? <GuestButtons /> : <ProfileDropdown dashboardRoute={dashboardHref} />}
      </div>
    </nav>
  );
}
