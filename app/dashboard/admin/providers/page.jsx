'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatusPill from '@/src/components/ui/StatusPill';
import AdminSearchBar from '@/src/components/admin/AdminSearchBar';
import Pagination, { PAGE_SIZE } from '@/src/components/admin/Pagination';
import { useServiceProviders, useUpdateAdminUser } from '@/src/hooks/admin/useAdmin';

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kandy', 'Matale', 'Galle', 'Matara', 'Nuwara Eliya',
    'Ratnapura', 'Kurunegala', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Ampara', 'Trincomalee', 'Batticaloa', 'Jaffna', 'Hambantota',
    'Kalutara', 'Puttalam',
];

const EM_DASH = '—';

const money = value => {
    if (value === null || value === undefined || value === '') return EM_DASH;
    const n = Number(value);
    return Number.isFinite(n) ? n.toLocaleString() : EM_DASH;
};

const rating = value => {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(1) : null;
};

const SEARCH_CATEGORIES = [
    { value: 'provider_id', label: 'Provider ID' },
    { value: 'user_id', label: 'User ID' },
    { value: 'experience_yr', label: 'Experience (years)' },
];

export default function AdminProvidersPage() {
    const router = useRouter();

    const { data, isPending: loading, error } = useServiceProviders();
    const updateUser = useUpdateAdminUser();
    const [search, setSearch] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [districtFilter, setDistrictFilter] = useState('');
    const [page, setPage] = useState(1);

    const providers = data?.providers ?? [];

    const filtered = providers.filter(p => {
        const q = search.trim().toLowerCase();
        const fullName = `${p.fname ?? ''} ${p.lname ?? ''}`.toLowerCase();

        const matchSearch = !q ? true : !searchCategory
            ? (
                fullName.includes(q) ||
                p.bio?.toLowerCase().includes(q) ||
                p.district?.toLowerCase().includes(q)
            )
            : searchCategory === 'provider_id'
                ? String(p.provider_id ?? '').toLowerCase().includes(q)
                : searchCategory === 'user_id'
                    ? String(p.user_id ?? '').toLowerCase().includes(q)
                    : searchCategory === 'experience_yr'
                        ? String(p.experience_yr ?? '').toLowerCase().includes(q)
                        : true;

        const matchDistrict = !districtFilter || p.district === districtFilter;
        return matchSearch && matchDistrict;
    });

    useEffect(() => {
        setPage(1);
    }, [search, searchCategory, districtFilter]);

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSuspend = async (userId, currentStatus) => {
        const next = currentStatus === 'suspended' ? 'active' : 'suspended';
        const verb = next === 'suspended' ? 'Suspend' : 'Reactivate';

        if (!window.confirm(`${verb} this user?`)) return;

        try {
            await updateUser.mutateAsync({ id: userId, payload: { status: next } });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Service Providers</h2>
                    <p className="text-xs text-muted mt-0.5">Monitor and verify professionals</p>
                </div>
            </div>

            {error && (
                <div className="px-3 py-2 mb-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
                    {error.message}
                </div>
            )}

            <AdminSearchBar
                search={search}
                onSearchChange={setSearch}
                searchCategory={searchCategory}
                onCategoryChange={setSearchCategory}
                categories={SEARCH_CATEGORIES}
                placeholder="Search by name, bio, or district…"
                secondaryFilter={{
                    value: districtFilter,
                    onChange: setDistrictFilter,
                    options: DISTRICTS,
                    allLabel: 'All Districts',
                }}
            />

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['Provider ID', 'User ID', 'Bio', 'Experience', 'Charge/Day', 'Avg Rating', 'Available', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={9} className="px-4 py-5 text-muted">Loading service providers…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={9} className="px-4 py-5 text-muted">No service providers found.</td></tr>
                        ) : paginated.map(p => (
                            <tr key={p.provider_id} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{p.provider_id}</td>
                                <td className="px-4 py-3 text-muted">{p.user_id}</td>
                                <td className="px-4 py-3 text-muted max-w-[120px] truncate">{p.bio}</td>
                                <td className="px-4 py-3 text-muted">{p.experience_yr ?? EM_DASH} yrs</td>
                                <td className="px-4 py-3 text-muted">LKR {money(p.charge_per_day)}</td>
                                <td className="px-4 py-3 text-amber-500 font-semibold">
                                    {rating(p.avg_rating) ? `⭐ ${rating(p.avg_rating)}` : EM_DASH}
                                </td>
                                <td className="px-4 py-3 text-muted">{p.is_available ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => router.push(`/dashboard/admin/users/${p.user_id}`)}
                                            className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleSuspend(p.user_id, p.status)}
                                            disabled={updateUser.isPending && updateUser.variables?.id === p.user_id}
                                            className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                                            {updateUser.isPending && updateUser.variables?.id === p.user_id ? '…' : p.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={page}
                    totalItems={filtered.length}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
