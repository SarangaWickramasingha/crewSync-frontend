'use client';
import PasswordInput from '@/Components/ui/PasswordInput';
import { Home, Wrench, Package } from 'lucide-react';


const ROLE_ICONS = {
    owner: <Home className="w-8 h-8 text-green-600" />,
    provider: <Wrench className="w-8 h-8 text-blue-600" />,
    supplier: <Package className="w-8 h-8 text-orange-500" />,
};
const ROLE_LABELS = { owner: 'Property Owner', provider: 'Service Provider', supplier: 'Supplier' };

export default function StepCredentials({ role, data, onChange }) {
    const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

    return (
        <div className="max-w-md mx-auto">
            {/* Welcome block */}
            <div className="text-center mb-7">
                <div className="flex justify-center mb-2">{ROLE_ICONS[role]}</div>
                <h3 className="font-syne text-lg font-bold text-slate">{ROLE_LABELS[role]} Account</h3>
                <p className="text-sm text-muted mt-1">Enter your email and create a password to get started.</p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-[11px] font-semibold text-slate-light uppercase tracking-wide">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={set('email')}
                    className="w-full px-3 py-[10px] border border-border rounded-lg text-sm text-slate
            bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
            placeholder:text-muted"
                />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-[11px] font-semibold text-slate-light uppercase tracking-wide">
                    Password <span className="text-red-500">*</span>
                </label>
                <PasswordInput
                    id="password"
                    value={data.password}
                    onChange={set('password')}
                    showStrength
                />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-light uppercase tracking-wide">
                    Confirm Password <span className="text-red-500">*</span>
                </label>
                <PasswordInput
                    id="confirmPassword"
                    placeholder="Re-enter password"
                    value={data.confirmPassword}
                    onChange={set('confirmPassword')}
                />
            </div>
        </div>
    );
}
