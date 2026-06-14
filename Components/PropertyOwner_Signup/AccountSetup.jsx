'use client';

import { useState } from 'react';

function getStrength(pwd) {
    if (!pwd) return { score: 0, label: 'Enter a password', cls: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const cls = score <= 1 ? 'weak' : score <= 2 ? 'fair' : 'strong';
    return { score, label: labels[score] || '', cls };
}

const segColor = {
    weak: 'bg-red-500',
    fair: 'bg-[#E8820C]',
    strong: 'bg-[#1B6E3A]',
};

export default function Step1AccountSetup({ email, password, confirmPassword, onChange }) {
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const strength = getStrength(password);

    return (
        <div className="max-w-[420px] mx-auto">
            {/* Welcome */}
            <div className="text-center mb-8">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="font-syne text-xl font-bold mb-1">Property Owner Account</h3>
                <p className="text-sm text-[#8A8FA8]">Enter your email and create a password to get started.</p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                    Email Address <span className="text-red-600">*</span>
                </label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => onChange('email', e.target.value)}
                    className="px-3 py-2.5 border border-black/10 rounded-lg text-sm text-[#1A1D23] bg-white outline-none transition-all focus:border-[#1B6E3A] focus:ring-2 focus:ring-[#1B6E3A]/10 placeholder:text-[#8A8FA8]"
                />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                    Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                    <input
                        type={showPwd ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => onChange('password', e.target.value)}
                        className="w-full px-3 py-2.5 pr-10 border border-black/10 rounded-lg text-sm text-[#1A1D23] bg-white outline-none transition-all focus:border-[#1B6E3A] focus:ring-2 focus:ring-[#1B6E3A]/10 placeholder:text-[#8A8FA8]"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8FA8] hover:text-[#1A1D23] transition-colors"
                    >
                        {showPwd ? '🙈' : '👁'}
                    </button>
                </div>
                {/* Strength bar */}
                <div className="mt-1">
                    <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-0.5 flex-1 rounded-sm transition-colors duration-300 ${i < strength.score && strength.cls ? segColor[strength.cls] : 'bg-black/10'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-[0.7rem] text-[#8A8FA8]">{strength.label}</p>
                </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                    Confirm Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => onChange('confirmPassword', e.target.value)}
                        className="w-full px-3 py-2.5 pr-10 border border-black/10 rounded-lg text-sm text-[#1A1D23] bg-white outline-none transition-all focus:border-[#1B6E3A] focus:ring-2 focus:ring-[#1B6E3A]/10 placeholder:text-[#8A8FA8]"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8FA8] hover:text-[#1A1D23] transition-colors"
                    >
                        {showConfirm ? '🙈' : '👁'}
                    </button>
                </div>
            </div>
        </div>
    );
}
