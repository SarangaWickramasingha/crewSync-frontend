'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import StatusPill from '@/Components/ui/StatusPill';

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    'http://localhost/CrewSync-backend/backend/index.php';

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

export default function AdminProvidersPage() {
    const router = useRouter();

    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [search, setSearch] = useState('');
    const [districtFilter, setDistrictFilter] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        fetch(`${API_BASE}/api/admin/users/service-providers`, {
            credentials: 'include',
            signal: controller.signal,
        })
            .then(res => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then(data => {
                if (!active) return;
                if (!data.success) throw new Error(data.message || 'Could not load service providers.');
                setProviders(data.providers ?? []);
            })
            .catch(err => {
                if (active && err.name !== 'AbortError') setError(err.message);
            })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; controller.abort(); };
    }, []);

    const filtered = providers.filter(p => {
        const q = search.trim().toLowerCase();
        const fullName = `${p.fname ?? ''} ${p.lname ?? ''}`.toLowerCase();
        const matchSearch =
            !q ||
            fullName.includes(q) ||
            p.bio?.toLowerCase().includes(q) ||
            p.district?.toLowerCase().includes(q);
        const matchDistrict = !districtFilter || p.district === districtFilter;
        return matchSearch && matchDistrict;
    });

    const handleSuspend = async (userId, currentStatus) => {
        const next = currentStatus === 'suspended' ? 'active' : 'suspended';
        const verb = next === 'suspended' ? 'Suspend' : 'Reactivate';

        if (!window.confirm(`${verb} this user?`)) return;

        setUpdatingId(userId);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: next }),
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Could not update status.');

            setProviders(prev => prev.map(p =>
                p.user_id === userId ? { ...p, status: next } : p
            ));
        } catch (e) {
            setError(e.message);
        } finally {
            setUpdatingId(null);
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
                    {error}
                </div>
            )}

            {/* Search + Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name, bio, or district…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-xs text-slate
                            bg-white focus:outline-none focus:border-amber placeholder:text-muted"
                    />
                </div>
                <select
                    value={districtFilter}
                    onChange={e => setDistrictFilter(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer"
                >
                    <option value="">All Districts</option>
                    {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

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
                        ) : filtered.map(p => (
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
                                            disabled={updatingId === p.user_id}
                                            className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                                            {updatingId === p.user_id ? '…' : p.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
