'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminCreateUserSchema } from '@/src/lib/validators/auth';
import { useCreateAdminUser } from '@/src/hooks/admin/useAdmin';

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle',
];

const DEFAULT_VALUES = {
    fname: '', lname: '', email: '', password: '', confirmPassword: '',
    contact_no: '', district: '', role: 'property_owner',
    address: '',
    bio: '', experience_yr: '', charge_per_day: '', willing_outside_region: false,
    business_name: '', business_address: '', is_hardware_shop: false,
};

export default function AdminAddUserPage() {
    const router = useRouter();
    const createUser = useCreateAdminUser();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const redirectTimer = useRef(null);

    const {
        register, handleSubmit, watch, setValue,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(adminCreateUserSchema), defaultValues: DEFAULT_VALUES });

    // Cancel the pending redirect if the user navigates away first.
    useEffect(() => () => clearTimeout(redirectTimer.current), []);

    const role = watch('role');

    const onSubmit = async values => {
        setError('');
        setSuccess('');

        // confirmPassword is a UI-only field — don't send it.
        const { confirmPassword, role: selectedRole, ...payload } = values;

        try {
            await createUser.mutateAsync({ ...payload, role: selectedRole });
            setSuccess('User created successfully.');
            redirectTimer.current = setTimeout(
                () => router.push('/dashboard/admin/users'),
                1200
            );
        } catch (e) {
            setError(e.message);
        }
    };

    const fieldError = name => errors[name] && (
        <p className="text-[11px] text-red-500 mt-1">{errors[name].message}</p>
    );

    const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber";

    const roles = [
        { id: 'property_owner', label: 'Property Owner' },
        { id: 'service_provider', label: 'Service Provider' },
        { id: 'material_supplier', label: 'Supplier' },
    ];

    return (
        <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg border border-border hover:bg-surface transition-all"
                >
                    <ArrowLeft className="w-4 h-4 text-slate" />
                </button>
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Add New User</h2>
                    <p className="text-xs text-muted mt-0.5">Create a new user account</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border rounded-xl p-6 flex flex-col gap-5">

                {/* Error / Success */}
                {error && (
                    <div className="px-3 py-2 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="px-3 py-2 rounded-lg text-xs bg-green-50 text-green-600 border border-green-200">
                        {success}
                    </div>
                )}

                {/* Role Selector */}
                <div>
                    <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-2">
                        User Role
                    </p>
                    <div className="bg-[#1A1D23] rounded-xl p-1.5 flex gap-1">
                        {roles.map(r => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setValue('role', r.id)}
                                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                                    ${role === r.id
                                        ? 'bg-amber text-white shadow-sm'
                                        : 'text-white/50 hover:text-white/80'
                                    }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Common Fields ── */}
                <div>
                    <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">
                        Personal Information
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {/* First Name */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">First Name <span className="text-red-500">*</span></label>
                            <input {...register('fname')} type="text" placeholder="Nimal" className={inputCls} />
                            {fieldError('fname')}
                        </div>
                        {/* Last Name */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Last Name <span className="text-red-500">*</span></label>
                            <input {...register('lname')} type="text" placeholder="Kumarasinghe" className={inputCls} />
                            {fieldError('lname')}
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Email <span className="text-red-500">*</span></label>
                            <input {...register('email')} type="email" placeholder="nimal@example.com" className={inputCls} />
                            {fieldError('email')}
                        </div>
                        {/* Contact */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Contact No <span className="text-red-500">*</span></label>
                            <input {...register('contact_no')} type="text" placeholder="077XXXXXXX" className={inputCls} />
                            {fieldError('contact_no')}
                        </div>
                        {/* District */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">District <span className="text-red-500">*</span></label>
                            <select {...register('district')} className={`${inputCls} cursor-pointer`}>
                                <option value="">Select district</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {fieldError('district')}
                        </div>
                        {/* Password */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Password <span className="text-red-500">*</span></label>
                            <input {...register('password')} type="password" placeholder="Min. 8 characters" className={inputCls} />
                            {fieldError('password')}
                        </div>
                        {/* Confirm Password */}
                        <div className="col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Confirm Password <span className="text-red-500">*</span></label>
                            <input {...register('confirmPassword')} type="password" placeholder="Re-enter password" className={inputCls} />
                            {fieldError('confirmPassword')}
                        </div>
                    </div>
                </div>

                {/* ── Role Specific Fields ── */}
                {role === 'property_owner' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">
                            Owner Details
                        </p>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Address <span className="text-red-500">*</span></label>
                            <textarea {...register('address')} placeholder="No. 12, Main Street, Kandy" rows={2}
                                className={`${inputCls} resize-none`} />
                            {fieldError('address')}
                        </div>
                    </div>
                )}

                {role === 'service_provider' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">
                            Provider Details
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Experience (years) <span className="text-red-500">*</span></label>
                                <input {...register('experience_yr')} type="number" placeholder="5" className={inputCls} />
                                {fieldError('experience_yr')}
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Charge Per Day (LKR)</label>
                                <input {...register('charge_per_day')} type="number" placeholder="3500" className={inputCls} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Bio</label>
                                <textarea {...register('bio')} placeholder="Brief description about the provider…" rows={2}
                                    className={`${inputCls} resize-none`} />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <input type="checkbox" id="willing" {...register('willing_outside_region')}
                                    className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="willing" className="text-xs text-slate cursor-pointer">Willing to work outside region</label>
                            </div>
                        </div>
                    </div>
                )}

                {role === 'material_supplier' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">
                            Supplier Details
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Business Name <span className="text-red-500">*</span></label>
                                <input {...register('business_name')} type="text" placeholder="Malshan Hardware" className={inputCls} />
                                {fieldError('business_name')}
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" id="hardware" {...register('is_hardware_shop')}
                                    className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="hardware" className="text-xs text-slate cursor-pointer">Has Hardware Store</label>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Business Address</label>
                                <textarea {...register('business_address')} placeholder="No. 45, Main Street, Kandy" rows={2}
                                    className={`${inputCls} resize-none`} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Footer Buttons ── */}
                <div className="flex justify-end gap-3 pt-2 border-t border-border">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 border border-border rounded-lg text-xs text-slate-light font-medium hover:bg-surface transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-amber text-white rounded-lg text-xs font-semibold hover:-translate-y-px transition-all shadow-sm disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {isSubmitting ? 'Creating…' : 'Create User'}
                    </button>
                </div>
            </form>
        </div>
    );
}
