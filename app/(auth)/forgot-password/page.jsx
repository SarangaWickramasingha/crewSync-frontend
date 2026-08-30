'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { API_AUTH_FORGOT_PASSWORD_SEND_OTP, API_AUTH_FORGOT_PASSWORD_RESET } from '@/config/api';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    // Step 1 — Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
        setLoading(true);
        try {
            const res = await fetch(API_AUTH_FORGOT_PASSWORD_SEND_OTP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) { setStep(2); }
            else { setError(data.message || 'Failed to send OTP'); }
        } catch {
            setError('Cannot connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2 — Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (otp.length !== 6) { setError('Please enter the 6-digit OTP.'); return; }
        setStep(3);
    };

    // Step 3 — Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
        setLoading(true);
        try {
            const res = await fetch(API_AUTH_FORGOT_PASSWORD_RESET, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Password reset successfully! Redirecting to login...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch {
            setError('Cannot connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F7F6F2]">
            {/* Main content expands to fill available vertical space */}
            <main className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-[420px]">
                    <div className="rounded-2xl overflow-hidden bg-white border border-[rgba(26,29,35,0.1)] shadow-[0_4px_24px_rgba(26,29,35,0.10)]">

                        {/* Header */}
                        <div className="bg-[#1A1D23] px-8 py-6 text-center">
                            <div className="font-syne text-xl font-extrabold tracking-tight select-none" style={{ color: '#E8820C' }}>
                                Crew<span className="text-white">Sync</span>
                            </div>
                            <p className="text-white/55 text-sm mt-1">
                                {step === 1 && 'Reset your password'}
                                {step === 2 && 'Enter verification code'}
                                {step === 3 && 'Create new password'}
                            </p>
                        </div>

                        <div className="px-8 py-6">

                            {/* Step indicator */}
                            <div className="flex items-center justify-between mb-6">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className="contents">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all shrink-0
                                                    ${s < step ? 'bg-green-500 border-green-500 text-white'
                                                : s === step ? 'bg-[#1A1D23] border-[#1A1D23] text-white'
                                                    : 'border-border text-muted'}`}>
                                            {s < step ? '✓' : s}
                                        </div>
                                        {s < 3 && (
                                            <div className={`flex-1 h-0.5 mx-3 rounded-full ${s < step ? 'bg-green-500' : 'bg-border'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {error && (
                                <div className="mb-4 px-3 py-2 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 px-3 py-2 rounded-lg text-xs bg-green-50 text-green-600 border border-green-200">
                                    {success}
                                </div>
                            )}

                            {/* Step 1 — Email */}
                            {step === 1 && (
                                <form onSubmit={handleSendOtp}>
                                    <p className="text-xs text-muted mb-4">Enter your registered email address and we&apos;ll send you a verification code.</p>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all border text-[#1A1D23]"
                                            onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-3 rounded-lg font-semibold text-sm text-white bg-[#E8820C] hover:bg-[#B85A00] transition-all disabled:opacity-50">
                                        {loading ? 'Sending...' : 'Send Verification Code'}
                                    </button>
                                </form>
                            )}

                            {/* Step 2 — OTP */}
                            {step === 2 && (
                                <form onSubmit={handleVerifyOtp}>
                                    <p className="text-xs text-muted mb-4">We sent a 6-digit code to <strong>{email}</strong>. Enter it below.</p>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">
                                            Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="000000"
                                            maxLength={6}
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all border text-[#1A1D23] text-center tracking-[0.5em] font-bold text-lg"
                                            onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                    <button type="submit"
                                        className="w-full py-3 rounded-lg font-semibold text-sm text-white bg-[#E8820C] hover:bg-[#B85A00] transition-all">
                                        Verify Code
                                    </button>
                                    <button type="button" onClick={() => setStep(1)}
                                        className="w-full mt-2 py-2 text-xs text-muted hover:text-slate transition-all">
                                        Back to email
                                    </button>
                                </form>
                            )}

                            {/* Step 3 — New Password */}
                            {step === 3 && (
                                <form onSubmit={handleResetPassword}>
                                    <p className="text-xs text-muted mb-4">Create a new password for your account.</p>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Min. 8 characters"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all border text-[#1A1D23]"
                                                onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                                onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8FA8] hover:text-[#1A1D23]">
                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Re-enter password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all border text-[#1A1D23]"
                                            onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-3 rounded-lg font-semibold text-sm text-white bg-[#E8820C] hover:bg-[#B85A00] transition-all disabled:opacity-50">
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            )}

                            <div className="mt-6 text-center">
                                <Link href="/login" className="text-xs text-muted hover:text-[#E8820C] transition-all">
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer pinned directly at the bottom */}
            <footer className="w-full bg-white py-4 text-center border-t border-gray-100">
                <p className="text-sm text-gray-500">
                    © 2025 CrewSync. All rights reserved. ·{" "}
                    <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a> ·{" "}
                    <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
                </p>
            </footer>
        </div>
    );
}