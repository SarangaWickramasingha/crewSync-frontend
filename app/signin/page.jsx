'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');


    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(
                "http://localhost/CrewSync-backend/backend/index.php/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {
                console.log("Login success:", data);

                // store token if you return JWT later
                // localStorage.setItem("token", data.token);

                alert("Login successful!");
            } else {
                console.log("Login failed:", data);
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F2' }}>


            {/* ── PAGE BODY ───────────────────────────────────────────────────── */}
            <main className="flex-1 flex items-center justify-center px-4 py-10 relative overflow-hidden">

                <div className="pointer-events-none absolute -top-32 -right-32 w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(232,130,12,0.08)_0%,transparent_70%)]" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(26,86,160,0.06)_0%,transparent_70%)]" />

                {/* ── CARD ──────────────────────────────────────────────────────── */}
                <div className="relative z-10 w-full max-w-115 rounded-xl overflow-hidden bg-white border border-[rgba(26,29,35,0.1)] shadow-[0_2px_16px_rgba(26,29,35,0.08)]">
                    <div className="text-center px-8 py-8 relative overflow-hidden bg-[#1A1D23]">
                        {/* glow behind logo */}
                        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(232,130,12,0.12)_0%,transparent_65%)]" />
                        <p className="text-[1.8rem] font-extrabold tracking-tight relative text-[#E8820C] font-sans-serif" >
                            Crew<span className="text-white">Sync</span>
                        </p>
                        <p className="text-[0.85rem] relative text-white/55" >
                            Sign in to your account
                        </p>
                    </div>

                    {/* Card body — the actual form */}
                    <div className="px-8 py-7">

                        {/* Error message — only shows when error state has text */}
                        {error && (
                            <div className="mb-4 px-3 py-2 rounded-lg text-[0.82rem] bg-[#FDECEA] text-[#C0392B] border outline-solid color-[#C0392B]" >
                                {error}
                            </div>
                        )}

                        {/* FORM — onSubmit calls handleSignIn */}
                        <form onSubmit={handleSignIn} noValidate>

                            {/* Email field */}
                            <div className="mb-4">
                                <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg text-[0.9rem] outline-none transition-all border color-[#1A1D23] font-sans-serif text-[#1A1D23]"
                                    onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>

                            {/* Password field with show/hide toggle */}
                            <div className="mb-4">
                                <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2.5 pr-10 rounded-lg text-[0.9rem] outline-none transition-all border color-[#1A1D23] font-sans-serif text-[#1A1D23]"
                                        onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                    {/* eye icon button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base cursor-pointer select-none text-[#8A8FA8]"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? '🙈' : '👁'}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me + Forgot password row */}
                            <div className="flex items-center justify-between mb-5">
                                <label className="flex items-center gap-2 text-[0.82rem] cursor-pointer text-[#4A5068]">

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
                                    className="text-[0.82rem] font-medium no-underline hover:underline text-[#E8820C]">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg font-semibold text-[0.95rem] text-white border-none cursor-pointer transition-all mb-5 tracking-wide bg-[#E8820C] font-sans-serif"
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
                                    className="font-semibold no-underline hover:underline text-[#E8820C]">

                                    Create a Property Owner account →
                                </Link>
                            </p>

                        </form>
                    </div>
                </div >
            </main >


        </div >

    )
}