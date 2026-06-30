'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle',
];

export default function AdminAddUserPage() {
    const router = useRouter();
    const [role, setRole] = useState('property_owner');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        // common user fields
        fname: '', lname: '', email: '', password: '', confirmPassword: '',
        contact_no: '', district: '',
        // property owner
        address: '',
        // service provider
        bio: '', experience_yr: '', charge_per_day: '', willing_outside_region: false,
        // material supplier
        business_name: '', business_address: '', is_hardware_shop: false,
    });

    const set = field => e => setForm(prev => ({
        ...prev,
        [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

    const validate = () => {
        if (!form.fname.trim()) return 'First name is required.';
        if (!form.lname.trim()) return 'Last name is required.';
        if (!form.email.includes('@')) return 'Please enter a valid email.';
        if (form.password.length < 8) return 'Password must be at least 8 characters.';
        if (form.password !== form.confirmPassword) return 'Passwords do not match.';
        if (!form.contact_no.trim()) return 'Contact number is required.';
        if (!form.district) return 'Please select a district.';
        if (role === 'property_owner' && !form.address.trim()) return 'Address is required.';
        if (role === 'service_provider' && !form.experience_yr) return 'Experience is required.';
        if (role === 'material_supplier' && !form.business_name.trim()) return 'Business name is required.';
        return null;
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        const err = validate();
        if (err) { setError(err); return; }

        // TODO: replace with real API call
        // const res = await fetch('/api/admin/users', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ ...form, role }),
        // });
        // const data = await res.json();
        // if (data.success) { router.push('/dashboard/admin/users'); }
        // else { setError(data.message); }

        setSuccess('User created successfully! (sample)');
        setTimeout(() => router.push('/dashboard/admin/users'), 1500);
    };

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

            <div className="bg-white border border-border rounded-xl p-6 flex flex-col gap-5">

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
                        {[
                            { id: 'property_owner', label: 'Property Owner' },
                            { id: 'service_provider', label: 'Service Provider' },
                            { id: 'material_supplier', label: 'Supplier' },
                        ].map(r => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
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
                            <input value={form.fname} onChange={set('fname')} type="text" placeholder="Nimal"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        {/* Last Name */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Last Name <span className="text-red-500">*</span></label>
                            <input value={form.lname} onChange={set('lname')} type="text" placeholder="Kumarasinghe"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Email <span className="text-red-500">*</span></label>
                            <input value={form.email} onChange={set('email')} type="email" placeholder="nimal@example.com"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        {/* Contact */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Contact No <span className="text-red-500">*</span></label>
                            <input value={form.contact_no} onChange={set('contact_no')} type="text" placeholder="077XXXXXXX"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        {/* District */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">District <span className="text-red-500">*</span></label>
                            <select value={form.district} onChange={set('district')}
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer">
                                <option value="">Select district</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        {/* Password */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Password <span className="text-red-500">*</span></label>
                            <input value={form.password} onChange={set('password')} type="password" placeholder="Min. 8 characters"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        {/* Confirm Password */}
                        <div className="col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Confirm Password <span className="text-red-500">*</span></label>
                            <input value={form.confirmPassword} onChange={set('confirmPassword')} type="password" placeholder="Re-enter password"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
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
                            <textarea value={form.address} onChange={set('address')} placeholder="No. 12, Main Street, Kandy" rows={2}
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber resize-none" />
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
                                <input value={form.experience_yr} onChange={set('experience_yr')} type="number" placeholder="5"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Charge Per Day (LKR)</label>
                                <input value={form.charge_per_day} onChange={set('charge_per_day')} type="number" placeholder="3500"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Bio</label>
                                <textarea value={form.bio} onChange={set('bio')} placeholder="Brief description about the provider…" rows={2}
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber resize-none" />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <input type="checkbox" id="willing" checked={form.willing_outside_region} onChange={set('willing_outside_region')}
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
                                <input value={form.business_name} onChange={set('business_name')} type="text" placeholder="Malshan Hardware"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" id="hardware" checked={form.is_hardware_shop} onChange={set('is_hardware_shop')}
                                    className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="hardware" className="text-xs text-slate cursor-pointer">Has Hardware Store</label>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Business Address</label>
                                <textarea value={form.business_address} onChange={set('business_address')} placeholder="No. 45, Main Street, Kandy" rows={2}
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber resize-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Footer Buttons ── */}
                <div className="flex justify-end gap-3 pt-2 border-t border-border">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2.5 border border-border rounded-lg text-xs text-slate-light font-medium hover:bg-surface transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-amber text-white rounded-lg text-xs font-semibold hover:-translate-y-px transition-all shadow-sm"
                    >
                        Create User
                    </button>
                </div>
            </div>
        </div>
    );
}