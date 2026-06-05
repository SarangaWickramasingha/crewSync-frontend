'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');

    // ── form validation ───────────────────────────────────────────────────────
    function handleSignIn(e) {
        e.preventDefault();           // stop page from refreshing
        setError('');                 // clear old errors

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        // TODO: replace this with a real API call to your PHP backend
        // Example:
        // const res = await fetch('/api/signin', { method:'POST', body: JSON.stringify({ email, password }) });
        // const data = await res.json();
        // if (data.success) router.push('/dashboard');

        // For now → redirect to dashboard page
        window.location.href = '/dashboard';
    }

    return (
        // ── outer page background ─────────────────────────────────────────────
        <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>

            {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
            <nav className="flex items-center justify-between px-6 h-[60px] sticky top-0 z-50"
                style={{ background: '#1A1D23' }}>
                {/* Logo */}
                <Link href="/"
                    className="text-[1.4rem] font-extrabold tracking-tight no-underline"
                    style={{ fontFamily: 'Syne, sans-serif', color: '#E8820C' }}>
                    Crew<span style={{ color: '#fff' }}>Sync</span>
                </Link>

                {/* Nav right link */}
                <span className="text-[0.82rem]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    New to CrewSync?{' '}
                    <Link href="/signup"
                        className="font-semibold no-underline hover:underline"
                        style={{ color: '#E8820C' }}>
                        Get Started
                    </Link>
                </span>
            </nav>

            {/* ── PAGE BODY ───────────────────────────────────────────────────── */}
            <main className="flex-1 flex items-center justify-center px-4 py-10 relative overflow-hidden">

                {/* decorative blobs — purely visual, no functionality */}
                <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(232,130,12,0.08) 0%, transparent 70%)' }} />
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(26,86,160,0.06) 0%, transparent 70%)' }} />

                {/* ── CARD ──────────────────────────────────────────────────────── */}
                <div className="relative z-10 w-full max-w-[460px] rounded-xl overflow-hidden"
                    style={{ background: '#fff', border: '1px solid rgba(26,29,35,0.1)', boxShadow: '0 2px 16px rgba(26,29,35,0.08)' }}>

                    {/* Card header (dark band) */}
                    <div className="text-center px-8 py-8 relative overflow-hidden"
                        style={{ background: '#1A1D23' }}>
                        {/* glow behind logo */}
                        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(232,130,12,0.12) 0%, transparent 65%)' }} />

                        <p className="text-[1.8rem] font-extrabold tracking-tight relative"
                            style={{ fontFamily: 'Syne, sans-serif', color: '#E8820C' }}>
                            Crew<span style={{ color: '#fff' }}>Sync</span>
                        </p>
                        <p className="text-[0.85rem] relative" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            Sign in to your account
                        </p>
                    </div>

                    {/* Card body — the actual form */}
                    <div className="px-8 py-7">

                        {/* Error message — only shows when error state has text */}
                        {error && (
                            <div className="mb-4 px-3 py-2 rounded-lg text-[0.82rem]"
                                style={{ background: '#FDECEA', color: '#C0392B', border: '1px solid rgba(192,57,43,0.2)' }}>
                                {error}
                            </div>
                        )}

                        {/* FORM — onSubmit calls handleSignIn */}
                        <form onSubmit={handleSignIn} noValidate>

                            {/* Email field */}
                            <div className="mb-4">
                                <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide"
                                    style={{ color: '#4A5068' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}   // updates email state as user types
                                    className="w-full px-3 py-2.5 rounded-lg text-[0.9rem] outline-none transition-all"
                                    style={{
                                        border: '1px solid rgba(26,29,35,0.1)',
                                        fontFamily: 'DM Sans, sans-serif',
                                        color: '#1A1D23',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>

                            {/* Password field with show/hide toggle */}
                            <div className="mb-4">
                                <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide"
                                    style={{ color: '#4A5068' }}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}   // toggles between text/password
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2.5 pr-10 rounded-lg text-[0.9rem] outline-none transition-all"
                                        style={{
                                            border: '1px solid rgba(26,29,35,0.1)',
                                            fontFamily: 'DM Sans, sans-serif',
                                            color: '#1A1D23',
                                        }}
                                        onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                    {/* eye icon button */}
                                    <button
                                        type="button"                                 // type=button so it doesn't submit the form
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base cursor-pointer select-none"
                                        style={{ color: '#8A8FA8' }}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? '🙈' : '👁'}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me + Forgot password row */}
                            <div className="flex items-center justify-between mb-5">
                                <label className="flex items-center gap-2 text-[0.82rem] cursor-pointer"
                                    style={{ color: '#4A5068' }}>
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="w-4 h-4 cursor-pointer"
                                        style={{ accentColor: '#E8820C' }}
                                    />
                                    Remember me
                                </label>
                                <Link href="/forgot-password"
                                    className="text-[0.82rem] font-medium no-underline hover:underline"
                                    style={{ color: '#E8820C' }}>
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg font-semibold text-[0.95rem] text-white border-none cursor-pointer transition-all mb-5 tracking-wide"
                                style={{ background: '#E8820C', fontFamily: 'DM Sans, sans-serif' }}
                                onMouseEnter={e => { e.target.style.background = '#B85A00'; e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 12px rgba(232,130,12,0.3)'; }}
                                onMouseLeave={e => { e.target.style.background = '#E8820C'; e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
                            >
                                Sign In
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 h-px" style={{ background: 'rgba(26,29,35,0.1)' }} />
                                <span className="text-[0.75rem]" style={{ color: '#8A8FA8' }}>Don't have an account?</span>
                                <div className="flex-1 h-px" style={{ background: 'rgba(26,29,35,0.1)' }} />
                            </div>

                            {/* Sign up prompt */}
                            <p className="text-center text-[0.83rem]" style={{ color: '#8A8FA8' }}>
                                New here?{' '}
                                <Link href="/signup"
                                    className="font-semibold no-underline hover:underline"
                                    style={{ color: '#E8820C' }}>
                                    Create a Property Owner account →
                                </Link>
                            </p>

                        </form>
                    </div>
                </div>
            </main>

            {/* ── FOOTER ──────────────────────────────────────────────────────── */}
            <footer className="text-center py-5 text-[0.75rem]"
                style={{ color: '#8A8FA8', borderTop: '1px solid rgba(26,29,35,0.1)', background: '#fff' }}>
                © 2025 CrewSync. All rights reserved. &nbsp;·&nbsp;
                <Link href="/privacy" className="no-underline hover:underline" style={{ color: '#E8820C' }}>Privacy Policy</Link>
                &nbsp;·&nbsp;
                <Link href="/terms" className="no-underline hover:underline" style={{ color: '#E8820C' }}>Terms of Service</Link>
            </footer>

        </div>
    );
}
