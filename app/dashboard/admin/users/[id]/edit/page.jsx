'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminUserSchema } from '@/src/lib/validators/auth';
import { useAdminUser, useUpdateAdminUser } from '@/src/hooks/admin/useAdmin';

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle',
];

/** MySQL/PHP hands back "0" and "1" as strings; "0" is truthy in JS. */
const bool = v => v === true || v === 1 || v === '1';

const DEFAULT_VALUES = {
    fname: '', lname: '', email: '', mobile: '', district: '', role: '',
    address: '', experience_yr: '', dailyRate: '', workRegion: '', bio: '',
    is_available: false, willing_outside_region: false,
    businessName: '', deliveryCoverage: '', delivery: false,
    hasHardwareStore: false, hwStoreName: '', hwAddress: '',
};

const toForm = u => ({
    fname: u.fname ?? '', lname: u.lname ?? '', email: u.email ?? '',
    mobile: u.mobile ?? '', district: u.district ?? '', role: u.role ?? '',
    address: u.address ?? '', experience_yr: u.experience_yr ?? '',
    dailyRate: u.dailyRate ?? '', workRegion: u.workRegion ?? '', bio: u.bio ?? '',
    is_available: bool(u.is_available), willing_outside_region: bool(u.willing_outside_region),
    businessName: u.businessName ?? '', deliveryCoverage: u.deliveryCoverage ?? '',
    delivery: bool(u.delivery), hasHardwareStore: bool(u.hasHardwareStore),
    hwStoreName: u.hwStoreName ?? '', hwAddress: u.hwAddress ?? '',
});

export default function AdminUserEditPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data, isPending: loading, error } = useAdminUser(id);
    const updateUser = useUpdateAdminUser();

    const {
        register, handleSubmit, reset, watch,
        formState: { errors, isDirty },
    } = useForm({ resolver: zodResolver(adminUserSchema), defaultValues: DEFAULT_VALUES });

    const redirectTimer = useRef(null);

    const user = data?.user;
    useEffect(() => {
        if (user) reset(toForm(user));
    }, [user, reset]);

    // Clear the pending redirect if the user navigates away first.
    useEffect(() => () => clearTimeout(redirectTimer.current), []);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const role = watch('role');

    const onSubmit = async values => {
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await updateUser.mutateAsync({ id, payload: values });
            setSuccessMsg('User updated successfully.');
            redirectTimer.current = setTimeout(
                () => router.push(`/dashboard/admin/users/${id}`),
                1500
            );
        } catch (e) {
            setErrorMsg(e.message);
        }
    };

    if (loading) return <p className="text-xs text-muted p-6">Loading…</p>;

    if (!user) return (
        <div className="text-center py-20">
            <p className="text-muted text-sm">{error?.message || 'User not found.'}</p>
            <button onClick={() => router.back()} className="mt-4 text-amber text-sm hover:underline">← Go back</button>
        </div>
    );

    const fieldError = name => errors[name] && (
        <p className="text-[11px] text-red-500 mt-1">{errors[name].message}</p>
    );

    const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber";

    return (
        <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()}
                    className="p-2 rounded-lg border border-border hover:bg-surface transition-all">
                    <ArrowLeft className="w-4 h-4 text-slate" />
                </button>
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Edit User</h2>
                    <p className="text-xs text-muted mt-0.5">{user.fname} {user.lname} — #{id}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border rounded-xl p-6 flex flex-col gap-5">

                {errorMsg && <div className="px-3 py-2 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">{errorMsg}</div>}
                {successMsg && <div className="px-3 py-2 rounded-lg text-xs bg-green-50 text-green-600 border border-green-200">{successMsg}</div>}

                {/* Personal Info */}
                <div>
                    <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">Personal Information</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">First Name <span className="text-red-500">*</span></label>
                            <input {...register('fname')} type="text" className={inputCls} />
                            {fieldError('fname')}
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Last Name <span className="text-red-500">*</span></label>
                            <input {...register('lname')} type="text" className={inputCls} />
                            {fieldError('lname')}
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Email <span className="text-red-500">*</span></label>
                            <input {...register('email')} type="email" className={inputCls} />
                            {fieldError('email')}
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Mobile <span className="text-red-500">*</span></label>
                            <input {...register('mobile')} type="text" className={inputCls} />
                            {fieldError('mobile')}
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">District <span className="text-red-500">*</span></label>
                            <select {...register('district')} className={`${inputCls} cursor-pointer`}>
                                <option value="">Select district</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {fieldError('district')}
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Role</label>
                            <select {...register('role')} className={`${inputCls} cursor-pointer`}>
                                <option value="">Select role</option>
                                <option value="property_owner">Property Owner</option>
                                <option value="service_provider">Service Provider</option>
                                <option value="material_supplier">Material Supplier</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Property Owner */}
                {role === 'property_owner' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">Owner Details</p>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Address</label>
                            <textarea {...register('address')} rows={2}
                                className={`${inputCls} resize-none`} />
                        </div>
                    </div>
                )}

                {/* Service Provider */}
                {role === 'service_provider' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">Provider Details</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Experience (years)</label>
                                <input {...register('experience_yr')} type="number" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Daily Rate (LKR)</label>
                                <input {...register('dailyRate')} type="number" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Work Region</label>
                                <input {...register('workRegion')} type="text" className={inputCls} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Bio</label>
                                <textarea {...register('bio')} rows={2}
                                    className={`${inputCls} resize-none`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="available" {...register('is_available')} className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="available" className="text-xs text-slate cursor-pointer">Currently Available</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="willing" {...register('willing_outside_region')} className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="willing" className="text-xs text-slate cursor-pointer">Willing Outside Region</label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Material Supplier */}
                {role === 'material_supplier' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">Supplier Details</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Business Name</label>
                                <input {...register('businessName')} type="text" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Delivery Coverage</label>
                                <input {...register('deliveryCoverage')} type="text" className={inputCls} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Business Address</label>
                                <textarea {...register('address')} rows={2}
                                    className={`${inputCls} resize-none`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="delivery" {...register('delivery')} className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="delivery" className="text-xs text-slate cursor-pointer">Delivery Available</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="hardware" {...register('hasHardwareStore')} className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="hardware" className="text-xs text-slate cursor-pointer">Has Hardware Store</label>
                            </div>
                            {watch('hasHardwareStore') && (
                                <>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-light mb-1">Store Name</label>
                                        <input {...register('hwStoreName')} type="text" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-light mb-1">Store Address</label>
                                        <input {...register('hwAddress')} type="text" className={inputCls} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2 border-t border-border">
                    <button type="button" onClick={() => router.back()} disabled={updateUser.isPending}
                        className="px-4 py-2.5 border border-border rounded-lg text-xs text-slate-light font-medium hover:bg-surface transition-all disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="submit" disabled={updateUser.isPending || !isDirty}
                        className="px-6 py-2.5 bg-amber text-white rounded-lg text-xs font-semibold hover:-translate-y-px transition-all shadow-sm disabled:opacity-50 disabled:hover:translate-y-0">
                        {updateUser.isPending ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
