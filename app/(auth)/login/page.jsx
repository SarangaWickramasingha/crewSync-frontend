'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/src/components/layout/Navbar';
import { loginSchema } from '@/src/lib/validators/auth';
import { useLogin } from '@/src/hooks/auth/useAuth';

export default function LoginPage() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '', remember: false },
    });

    const loginMutation = useLogin();

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const redirectByRole = (role) => {
        if (role === 'property_owner') {
            window.location.assign('/dashboard/propertyowner');
        } else if (role === 'admin') {
            window.location.assign('/dashboard/admin');
        } else if (role === 'service_provider') {
            window.location.assign('/dashboard/serviceprovider');
        } else if (role === 'material_supplier') {
            window.location.assign('/dashboard/supplier');
        } else {
            window.location.assign('/home');
        }
    };

    const handleSignIn = handleSubmit(async (values) => {
        setError('');
        try {
            const data = await loginMutation.mutateAsync({ email: values.email, password: values.password });

            login({
                user_id: data.user.user_id,
                name: data.user.name,
                role: data.user.role
            });
            redirectByRole(data.user.role);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Cannot connect to server. Please try again.');
        }
    });
    return (
        <>
            <Navbar variant="auth" />
            <div className="flex h-[calc(100vh-60px)]">

                {/* ── Left: Image Panel ── */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img
                        src="/images/login-bg.jpg"
                        alt="Construction site"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1D23]/80 via-[#1A1D23]/50 to-transparent" />

                    {/* Content on top of image */}
                    <div
                        className="relative z-10 flex flex-col justify-between h-full p-10"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                            transition: 'opacity 0.7s ease, transform 0.7s ease',
                        }}
                    >
                        <div />

                        {/* Bottom tagline */}
                        <div>
                            <p className="text-white text-2xl font-bold leading-snug mb-3">
                                Build smarter<br />Connect faster
                            </p>
                            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                                Sri Lanka&apos;s construction coordination platform - connecting property owners,
                                service providers, and suppliers in one place.
                            </p>

                            {/* Stats row */}
                            <div className="flex gap-6 mt-6">
                                {[
                                    { val: '500+', lbl: 'Professionals' },
                                    { val: '1,200+', lbl: 'Projects' },
                                    { val: '25+', lbl: 'Districts' },
                                ].map(s => (
                                    <div key={s.lbl}>
                                        <p className="text-[#E8820C] text-lg font-bold">{s.val}</p>
                                        <p className="text-white/50 text-xs">{s.lbl}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right: Form Panel ── */}
                <div className="flex-1 flex items-center justify-center bg-[#F7F6F2] px-6 py-4">
                    <div
                        className="w-full max-w-[420px]"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(32px)',
                            transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
                        }}
                    >
                        {/* Mobile-only logo */}
                        <p className="lg:hidden font-climate text-[1.6rem] tracking-tight text-[#E8820C] mb-4 text-center">
                            Crew<span className="text-[#1A1D23]">Sync</span>
                        </p>

                        <div className="rounded-2xl overflow-hidden bg-white border border-[rgba(26,29,35,0.1)] shadow-[0_4px_24px_rgba(26,29,35,0.10)]">

                            {/* Card body */}
                            <div className="px-8 py-6">

                                {/* Title */}
                                <h2 className="font-syne text-lg font-bold text-[#1A1D23] mb-1">Sign in</h2>
                                <p className="text-xs text-[#64748b] mb-5">Enter your credentials to continue.</p>

                                {error && (
                                    <div className="mb-4 px-3 py-2 rounded-lg text-[0.82rem] bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSignIn} noValidate>

                                    {/* Email */}
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            {...register('email')}
                                            className="w-full px-3 py-2.5 rounded-lg text-[0.9rem] outline-none transition-all border text-[#1A1D23]"
                                            onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                        {errors.email && (
                                            <p className="mt-1.5 text-[0.78rem] text-[#C0392B]">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-[#4A5068]">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                {...register('password')}
                                                className="w-full px-3 py-2.5 pr-10 rounded-lg text-[0.9rem] outline-none transition-all border text-[#1A1D23]"
                                                onFocus={e => { e.target.style.borderColor = '#E8820C'; e.target.style.boxShadow = '0 0 0 3px rgba(232,130,12,0.1)'; }}
                                                onBlur={e => { e.target.style.borderColor = 'rgba(26,29,35,0.1)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#8A8FA8] hover:text-[#1A1D23] transition-colors"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-[0.78rem] text-[#C0392B]">{errors.password.message}</p>
                                    )}

                                    {/* Remember + Forgot */}
                                    <div className="flex items-center justify-between mb-5">
                                        <label className="flex items-center gap-2 text-[0.82rem] cursor-pointer text-[#4A5068]">
                                            <input
                                                type="checkbox"
                                                {...register('remember')}
                                                className="w-4 h-4 cursor-pointer"
                                                style={{ accentColor: '#E8820C' }}
                                            />
                                            Remember me
                                        </label>
                                        <Link href="/forgot-password" className="text-[0.82rem] font-medium hover:underline text-[#E8820C]">
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loginMutation.isPending}
                                        className="w-full py-3 rounded-lg font-semibold text-[0.95rem] text-white cursor-pointer transition-all mb-5 tracking-wide bg-[#E8820C] hover:bg-[#B85A00] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(232,130,12,0.3)] disabled:opacity-60"
                                    >
                                        {loginMutation.isPending ? 'Signing in…' : 'Sign In'}
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex-1 h-px bg-[rgba(26,29,35,0.1)]" />
                                        <span className="text-[0.75rem] text-[#8A8FA8]">Don&apos;t have an account?</span>
                                        <div className="flex-1 h-px bg-[rgba(26,29,35,0.1)]" />
                                    </div>

                                    <p className="text-center text-[0.83rem] text-[#8A8FA8]">
                                        New here?{' '}
                                        <Link href="/register" className="font-semibold hover:underline text-[#E8820C]">
                                            Create an account →
                                        </Link>
                                    </p>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
