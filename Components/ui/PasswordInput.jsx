'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


// Strength: 0=empty, 1=weak, 2=fair, 3=good, 4=strong
function getStrength(val) {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', 'bg-red-500', 'bg-amber-500', 'bg-primary', 'bg-primary'];

export default function PasswordInput({
    id,
    placeholder = 'Min. 8 characters',
    value,
    onChange,
    showStrength = false,
    className = '',
    ...props
}) {
    const [visible, setVisible] = useState(false);
    const strength = showStrength ? getStrength(value) : 0;

    return (
        <div>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-3 py-[10px] border border-border rounded-lg text-sm text-slate
            bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
            placeholder:text-muted pr-10 ${className}`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setVisible(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate text-base leading-none"
                    tabIndex={-1}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                >
                    {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}

                </button>
            </div>

            {showStrength && (
                <div className="mt-1.5">
                    <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className={`h-[3px] flex-1 rounded-full transition-all duration-300
                  ${strength >= i ? STRENGTH_COLORS[strength] : 'bg-border'}`}
                            />
                        ))}
                    </div>
                    <p className="text-[11px] text-muted">
                        {value ? STRENGTH_LABELS[strength] : 'Enter a password'}
                    </p>
                </div>
            )}
        </div>
    );
}
