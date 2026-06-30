'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Star, Briefcase, Package } from 'lucide-react';
import StatusPill from '@/Components/ui/StatusPill';

// ── Sample data (replace with API call when backend is ready) ──
// TODO: fetch from GET /api/admin/users/:id
const SAMPLE_USERS = {
    1: {
        user_id: 1, fname: 'Nimal', lname: 'Kumarasinghe',
        email: 'nimal@example.com', mobile: '0771234567',
        district: 'Kandy', role: 'property_owner', created_at: 'Jan 2026', status: 'Active',
        address: 'No. 12, Main Street, Kandy',
        projects: 3,
    },
    2: {
        user_id: 2, fname: 'Sunil', lname: 'Karunaratne',
        email: 'sunil@example.com', mobile: '0779876543',
        district: 'Kandy', role: 'service_provider', created_at: 'Feb 2026', status: 'Active',
        bio: 'Experienced mason with 10+ years in residential construction.',
        experience_yr: 10, dailyRate: 3500, workRegion: 'Kandy',
        skills: ['Masonry', 'Plastering', 'Tiling'],
        is_available: true, willing_outside_region: false, avg_rating: 4.9,
    },
    3: {
        user_id: 3, fname: 'Malshan', lname: 'Hardware',
        email: 'malshan@example.com', mobile: '0760001122',
        district: 'Kandy', role: 'material_supplier', created_at: 'Mar 2026', status: 'Active',
        businessName: 'Malshan Hardware Pvt Ltd',
        address: 'No. 45, Peradeniya Road, Kandy',
        delivery: true, deliveryCoverage: 'Kandy, Matale',
        materials: ['Cement', 'Sand', 'Bricks'],
        hasHardwareStore: true, hwStoreName: 'Malshan Hardware', hwAddress: 'No. 45, Peradeniya Road',
        avg_rating: 4.5,
    },
};

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col gap-0.5 py-2.5 border-b border-border last:border-0">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">{label}</p>
            <p className="text-sm text-slate">{value ?? '—'}</p>
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
    const user = SAMPLE_USERS[id];

    if (!user) return (
        <div className="text-center py-20">
            <p className="text-muted text-sm">User not found.</p>
            <button onClick={() => router.back()} className="mt-4 text-amber text-sm hover:underline">← Go back</button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">

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
                    {/* TODO: wire Delete to API */}
                    <button className="px-4 py-2 border border-red-200 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition-all">
                        Delete
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
                <InfoRow label="Role" value={user.role.replace('_', ' ').toUpperCase()} />
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
                        <InfoRow label="Experience" value={`${user.experience_yr} years`} />
                        <InfoRow label="Daily Rate" value={`LKR ${user.dailyRate?.toLocaleString()}`} />
                        <InfoRow label="Work Region" value={user.workRegion} />
                        <InfoRow label="Average Rating" value={`⭐ ${user.avg_rating}`} />
                        <InfoRow label="Available" value={user.is_available ? 'Yes' : 'No'} />
                        <InfoRow label="Willing Outside Region" value={user.willing_outside_region ? 'Yes' : 'No'} />
                    </Section>
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2 pt-1">
                            {user.skills?.map(s => (
                                <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">{s}</span>
                            ))}
                        </div>
                    </Section>
                </>
            )}

            {/* Material Supplier */}
            {user.role === 'material_supplier' && (
                <>
                    <Section title="Supplier Details">
                        <InfoRow label="Business Name" value={user.businessName} />
                        <InfoRow label="Business Address" value={user.address} />
                        <InfoRow label="Delivery Available" value={user.delivery ? 'Yes' : 'No'} />
                        <InfoRow label="Delivery Coverage" value={user.deliveryCoverage} />
                        <InfoRow label="Average Rating" value={`⭐ ${user.avg_rating}`} />
                        <InfoRow label="Has Hardware Store" value={user.hasHardwareStore ? 'Yes' : 'No'} />
                        {user.hasHardwareStore && (
                            <>
                                <InfoRow label="Hardware Store Name" value={user.hwStoreName} />
                                <InfoRow label="Hardware Store Address" value={user.hwAddress} />
                            </>
                        )}
                    </Section>
                    <Section title="Materials Supplied">
                        <div className="flex flex-wrap gap-2 pt-1">
                            {user.materials?.map(m => (
                                <span key={m} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">{m}</span>
                            ))}
                        </div>
                    </Section>
                </>
            )}
        </div>
    );
}
