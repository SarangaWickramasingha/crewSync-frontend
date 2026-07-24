'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    'http://localhost/CrewSync-backend/backend/index.php';

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle',
];

/** MySQL/PHP hands back "0" and "1" as strings; "0" is truthy in JS. */
const bool = v => v === true || v === 1 || v === '1';

export default function AdminUserEditPage() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const redirectTimer = useRef(null);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();
        let active = true;

        fetch(`${API_BASE}/api/admin/users/${id}`, {
            credentials: 'include',
            signal: controller.signal,
        })
            .then(res => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then(data => {
                if (!active) return;
                if (!data.success) throw new Error(data.message || 'User not found.');
                setForm(data.user);
            })
            .catch(err => {
                if (active && err.name !== 'AbortError') setError(err.message);
            })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; controller.abort(); };
    }, [id]);

    // Clear the pending redirect if the user navigates away first.
    useEffect(() => () => clearTimeout(redirectTimer.current), []);

    const set = field => e => setForm(prev => ({
        ...prev,
        [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

    const validate = () => {
        if (!form.fname?.trim()) return 'First name is required.';
        if (!form.lname?.trim()) return 'Last name is required.';
        if (!form.email?.includes('@')) return 'Please enter a valid email.';
        if (!form.mobile?.trim()) return 'Mobile number is required.';
        if (!form.district) return 'Please select a district.';
        return null;
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        const err = validate();
        if (err) { setError(err); return; }

        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Could not update user.');

            setSuccess('User updated successfully.');
            redirectTimer.current = setTimeout(
                () => router.push(`/dashboard/admin/users/${id}`),
                1500
            );
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-xs text-muted p-6">Loading…</p>;

    if (!form) return (
        <div className="text-center py-20">
            <p className="text-muted text-sm">{error || 'User not found.'}</p>
            <button onClick={() => router.back()} className="mt-4 text-amber text-sm hover:underline">← Go back</button>
        </div>
    );

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
                    <p className="text-xs text-muted mt-0.5">{form.fname} {form.lname} — #{id}</p>
                </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-6 flex flex-col gap-5">

                {error && <div className="px-3 py-2 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">{error}</div>}
                {success && <div className="px-3 py-2 rounded-lg text-xs bg-green-50 text-green-600 border border-green-200">{success}</div>}

                {/* Personal Info */}
                <div>
                    <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">Personal Information</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">First Name <span className="text-red-500">*</span></label>
                            <input value={form.fname ?? ''} onChange={set('fname')} type="text"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Last Name <span className="text-red-500">*</span></label>
                            <input value={form.lname ?? ''} onChange={set('lname')} type="text"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Email <span className="text-red-500">*</span></label>
                            <input value={form.email ?? ''} onChange={set('email')} type="email"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Mobile <span className="text-red-500">*</span></label>
                            <input value={form.mobile ?? ''} onChange={set('mobile')} type="text"
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">District <span className="text-red-500">*</span></label>
                            <select value={form.district ?? ''} onChange={set('district')}
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer">
                                <option value="">Select district</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Role</label>
                            <select value={form.role ?? ''} onChange={set('role')}
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer">
                                <option value="">Select role</option>
                                <option value="property_owner">Property Owner</option>
                                <option value="service_provider">Service Provider</option>
                                <option value="material_supplier">Material Supplier</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Property Owner */}
                {form.role === 'property_owner' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">Owner Details</p>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-light mb-1">Address</label>
                            <textarea value={form.address ?? ''} onChange={set('address')} rows={2}
                                className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber resize-none" />
                        </div>
                    </div>
                )}

                {/* Service Provider */}
                {form.role === 'service_provider' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">Provider Details</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Experience (years)</label>
                                <input value={form.experience_yr ?? ''} onChange={set('experience_yr')} type="number"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Daily Rate (LKR)</label>
                                <input value={form.dailyRate ?? ''} onChange={set('dailyRate')} type="number"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Work Region</label>
                                <input value={form.workRegion ?? ''} onChange={set('workRegion')} type="text"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Bio</label>
                                <textarea value={form.bio ?? ''} onChange={set('bio')} rows={2}
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber resize-none" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="available" checked={bool(form.is_available)} onChange={set('is_available')} className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="available" className="text-xs text-slate cursor-pointer">Currently Available</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="willing" checked={bool(form.willing_outside_region)} onChange={set('willing_outside_region')} className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="willing" className="text-xs text-slate cursor-pointer">Willing Outside Region</label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Material Supplier */}
                {form.role === 'material_supplier' && (
                    <div>
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-3">Supplier Details</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Business Name</label>
                                <input value={form.businessName ?? ''} onChange={set('businessName')} type="text"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Delivery Coverage</label>
                                <input value={form.deliveryCoverage ?? ''} onChange={set('deliveryCoverage')} type="text"
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-light mb-1">Business Address</label>
                                <textarea value={form.address ?? ''} onChange={set('address')} rows={2}
                                    className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber resize-none" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="delivery" checked={bool(form.delivery)} onChange={set('delivery')} className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="delivery" className="text-xs text-slate cursor-pointer">Delivery Available</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="hardware" checked={bool(form.hasHardwareStore)} onChange={set('hasHardwareStore')} className="w-4 h-4 cursor-pointer accent-amber" />
                                <label htmlFor="hardware" className="text-xs text-slate cursor-pointer">Has Hardware Store</label>
                            </div>
                            {bool(form.hasHardwareStore) && (
                                <>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-light mb-1">Store Name</label>
                                        <input value={form.hwStoreName ?? ''} onChange={set('hwStoreName')} type="text"
                                            className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-light mb-1">Store Address</label>
                                        <input value={form.hwAddress ?? ''} onChange={set('hwAddress')} type="text"
                                            className="w-full px-3 py-2.5 border border-border rounded-lg text-xs text-slate bg-white focus:outline-none focus:border-amber" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2 border-t border-border">
                    <button onClick={() => router.back()} disabled={saving}
                        className="px-4 py-2.5 border border-border rounded-lg text-xs text-slate-light font-medium hover:bg-surface transition-all disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={saving}
                        className="px-6 py-2.5 bg-amber text-white rounded-lg text-xs font-semibold hover:-translate-y-px transition-all shadow-sm disabled:opacity-50 disabled:hover:translate-y-0">
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}