'use client';
import PasswordInput from '@/src/components/ui/PasswordInput';
import { Home, Wrench, Package } from 'lucide-react';

const ROLE_ICONS = {
    owner: <Home className="w-8 h-8 text-green-600" />,
    provider: <Wrench className="w-8 h-8 text-blue-600" />,
    supplier: <Package className="w-8 h-8 text-orange-500" />,
};
const ROLE_LABELS = { owner: 'Property Owner', provider: 'Service Provider', supplier: 'Supplier' };

export default function StepCredentials({ role, register, errors, watch, setValue }) {
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
                    {...register('email')}
                    className="w-full px-3 py-[10px] border border-border rounded-lg text-sm text-slate
            bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
            placeholder:text-muted"
                />
                {errors.email && (
                    <p className="text-[11px] text-red-500">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 mb-4">
                <label className="text-[11px] font-semibold text-slate-light uppercase tracking-wide">
                    Password <span className="text-red-500">*</span>
                </label>
                {/* Password */}
                <PasswordInput
                    id="password"
                    value={watch('password')}
                    onChange={(e) => setValue('password', e.target.value, { shouldValidate: true, shouldDirty: true })}
                    showStrength
                />

                {errors.password && (
                    <p className="text-[11px] text-red-500">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-light uppercase tracking-wide">
                    Confirm Password <span className="text-red-500">*</span>
                </label>
                {/* Confirm Password */}
                <PasswordInput
                    id="confirmPassword"
                    placeholder="Re-enter password"
                    value={watch('confirmPassword')}
                    onChange={(e) => setValue('confirmPassword', e.target.value, { shouldValidate: true, shouldDirty: true })}
                />
                {errors.confirmPassword && (
                    <p className="text-[11px] text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>
        </div>
    );
}
