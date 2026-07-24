'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import StatusPill from '@/Components/ui/StatusPill';

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    'http://localhost/CrewSync-backend/backend/index.php';

const EM_DASH = '—';

/** MySQL/PHP hands back "0" and "1" as strings; "0" is truthy in JS. */
const bool = v => v === true || v === 1 || v === '1';

const money = value => {
    if (value === null || value === undefined || value === '') return EM_DASH;
    const n = Number(value);
    return Number.isFinite(n) ? n.toLocaleString() : EM_DASH;
};

const roleLabel = role =>
    role ? role.replaceAll('_', ' ').toUpperCase() : EM_DASH;

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col gap-0.5 py-2.5 border-b border-border last:border-0">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">{label}</p>
            <p className="text-sm text-slate">{value ?? EM_DASH}</p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white border border-border rounded-xl p-5 mb-4">
            <h3 className="font-syne text-sm font-bold text-slate mb-3 pb-2 border-b border-border">{title}</h3>
            {children}
        </div>
    );
}

export default function AdminUserViewPage() {
    const { id } = useParams();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

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
                setUser(data.user);
            })
            .catch(err => {
                if (active && err.name !== 'AbortError') setError(err.message);
            })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; controller.abort(); };
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${user.fname} ${user.lname}? This cannot be undone.`)) return;

        setDeleting(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Could not delete this user.');

            router.push('/dashboard/admin/users');
        } catch (e) {
            // Only reset on failure — on success this component unmounts.
            setError(e.message);
            setDeleting(false);
        }
    };

    if (loading) return <p className="text-xs text-muted p-6">Loading…</p>;

    if (!user) return (
        <div className="text-center py-20">
            <p className="text-muted text-sm">{error || 'User not found.'}</p>
            <button onClick={() => router.back()} className="mt-4 text-amber text-sm hover:underline">← Go back</button>
        </div>
    );

    const skills = user.skills ?? [];
    const materials = user.materials ?? [];

    return (
        <div className="max-w-2xl mx-auto">

            {error && (
                <div className="px-3 py-2 mb-4 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()}
                        className="p-2 rounded-lg border border-border hover:bg-surface transition-all">
                        <ArrowLeft className="w-4 h-4 text-slate" />
                    </button>
                    <div>
                        <h2 className="font-syne text-xl font-bold text-slate">
                            {user.fname} {user.lname}
                        </h2>
                        <p className="text-xs text-muted mt-0.5">User ID: #{user.user_id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <StatusPill status={user.status} />
                    <button
                        onClick={() => router.push(`/dashboard/admin/users/${id}/edit`)}
                        className="px-4 py-2 bg-amber text-white text-xs font-semibold rounded-lg hover:bg-amber-dark transition-all">
                        Edit User
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-4 py-2 border border-red-200 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition-all disabled:opacity-50">
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>

            {/* Basic Info */}
            <Section title="Personal Information">
                <InfoRow label="First Name" value={user.fname} />
                <InfoRow label="Last Name" value={user.lname} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Mobile" value={user.mobile} />
                <InfoRow label="District" value={user.district} />
                <InfoRow label="Role" value={roleLabel(user.role)} />
                <InfoRow label="Member Since" value={user.created_at} />
            </Section>

            {/* Property Owner */}
            {user.role === 'property_owner' && (
                <Section title="Owner Details">
                    <InfoRow label="Address" value={user.address} />
                    <InfoRow label="Total Projects" value={user.projects} />
                </Section>
            )}

            {/* Service Provider */}
            {user.role === 'service_provider' && (
                <>
                    <Section title="Provider Details">
                        <InfoRow label="Bio" value={user.bio} />
                        <InfoRow label="Experience" value={user.experience_yr ? `${user.experience_yr} years` : EM_DASH} />
                        <InfoRow label="Daily Rate" value={`LKR ${money(user.dailyRate)}`} />
                        <InfoRow label="Work Region" value={user.workRegion} />
                        <InfoRow label="Average Rating" value={user.avg_rating ? `⭐ ${Number(user.avg_rating).toFixed(1)}` : EM_DASH} />
                        <InfoRow label="Available" value={bool(user.is_available) ? 'Yes' : 'No'} />
                        <InfoRow label="Willing Outside Region" value={bool(user.willing_outside_region) ? 'Yes' : 'No'} />
                    </Section>
                    <Section title="Skills">
                        {skills.length === 0 ? (
                            <p className="text-xs text-muted pt-1">No skills listed.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {skills.map(s => (
                                    <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">{s}</span>
                                ))}
                            </div>
                        )}
                    </Section>
                </>
            )}

            {/* Material Supplier */}
            {user.role === 'material_supplier' && (
                <>
                    <Section title="Supplier Details">
                        <InfoRow label="Business Name" value={user.businessName} />
                        <InfoRow label="Business Address" value={user.address} />
                        <InfoRow label="Delivery Available" value={bool(user.delivery) ? 'Yes' : 'No'} />
                        <InfoRow label="Delivery Coverage" value={user.deliveryCoverage} />
                        <InfoRow label="Average Rating" value={user.avg_rating ? `⭐ ${Number(user.avg_rating).toFixed(1)}` : EM_DASH} />
                        <InfoRow label="Has Hardware Store" value={bool(user.hasHardwareStore) ? 'Yes' : 'No'} />
                        {bool(user.hasHardwareStore) && (
                            <>
                                <InfoRow label="Hardware Store Name" value={user.hwStoreName} />
                                <InfoRow label="Hardware Store Address" value={user.hwAddress} />
                            </>
                        )}
                    </Section>
                    <Section title="Materials Supplied">
                        {materials.length === 0 ? (
                            <p className="text-xs text-muted pt-1">No materials listed.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {materials.map(m => (
                                    <span key={m} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">{m}</span>
                                ))}
                            </div>
                        )}
                    </Section>
                </>
            )}
        </div>
    );
}