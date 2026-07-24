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

export default function AdminPropertyOwnersPage() {
    const router = useRouter();

    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [search, setSearch] = useState('');
    const [districtFilter, setDistrictFilter] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        fetch(`${API_BASE}/api/admin/users/property-owners`, {
            credentials: 'include',
            signal: controller.signal,
        })
            .then(res => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then(data => {
                if (!active) return;
                if (!data.success) throw new Error(data.message || 'Could not load property owners.');
                setOwners(data.owners ?? []);
            })
            .catch(err => {
                if (active && err.name !== 'AbortError') setError(err.message);
            })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; controller.abort(); };
    }, []);

    const filtered = owners.filter(o => {
        const q = search.trim().toLowerCase();
        const fullName = `${o.fname ?? ''} ${o.lname ?? ''}`.toLowerCase();
        const matchSearch =
            !q ||
            fullName.includes(q) ||
            o.email?.toLowerCase().includes(q) ||
            o.address?.toLowerCase().includes(q) ||
            o.district?.toLowerCase().includes(q);
        const matchDistrict = !districtFilter || o.district === districtFilter;
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

            setOwners(prev => prev.map(o =>
                o.user_id === userId ? { ...o, status: next } : o
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
                    <h2 className="font-syne text-xl font-bold text-slate">Property Owners</h2>
                    <p className="text-xs text-muted mt-0.5">All registered property owners</p>
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
                        placeholder="Search by name, email, or address…"
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
                            {['Owner ID', 'User ID', 'Email', 'Contact No', 'Address', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={7} className="px-4 py-5 text-muted">Loading property owners…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-5 text-muted">No property owners found.</td></tr>
                        ) : filtered.map(o => (
                            <tr key={o.owner_id} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{o.owner_id}</td>
                                <td className="px-4 py-3 text-muted">{o.user_id}</td>
                                <td className="px-4 py-3 text-muted">{o.email}</td>
                                <td className="px-4 py-3 text-muted">{o.contact_no}</td>
                                <td className="px-4 py-3 text-muted max-w-[180px] truncate">{o.address}</td>
                                <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => router.push(`/dashboard/admin/users/${o.user_id}`)}
                                            className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleSuspend(o.user_id, o.status)}
                                            disabled={updatingId === o.user_id}
                                            className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                                            {updatingId === o.user_id ? '…' : o.status === 'suspended' ? 'Reactivate' : 'Suspend'}
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