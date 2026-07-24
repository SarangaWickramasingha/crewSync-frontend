'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    'http://localhost/CrewSync-backend/backend/index.php';

const ROLE_LABEL = {
    property_owner: 'Property Owner',
    service_provider: 'Service Provider',
    material_supplier: 'Material Supplier',
    admin: 'Admin',
};

export default function AdminUsersPage() {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        fetch(`${API_BASE}/api/admin/users`, {
            credentials: 'include',
            signal: controller.signal,
        })
            .then(res => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then(data => {
                if (!active) return;
                if (!data.success) throw new Error(data.message || 'Could not load users.');
                setUsers(data.users ?? []);
            })
            .catch(err => {
                if (active && err.name !== 'AbortError') setError(err.message);
            })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; controller.abort(); };
    }, []);

    const filtered = users.filter(u => {
        const q = search.trim().toLowerCase();
        const fullName = `${u.fname ?? ''} ${u.lname ?? ''}`.toLowerCase();
        const matchSearch =
            !q ||
            fullName.includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q) ||
            u.district?.toLowerCase().includes(q);
        const matchRole = !roleFilter || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const handleDelete = async (userId, name) => {
        if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;

        setDeletingId(userId);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Could not delete this user.');

            // Only drop the row once the server has confirmed.
            setUsers(prev => prev.filter(u => u.user_id !== userId));
        } catch (e) {
            setError(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">User Management</h2>
                    <p className="text-xs text-muted mt-0.5">All registered accounts</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/admin/users/new')}
                    className="px-4 py-2 bg-amber text-white text-xs font-semibold rounded-lg hover:bg-amber-dark transition-all">
                    + Add User
                </button>
            </div>

            {error && (
                <div className="px-3 py-2 mb-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name, email, role, or district…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-xs text-slate
                            bg-white focus:outline-none focus:border-amber placeholder:text-muted"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer"
                >
                    <option value="">All Roles</option>
                    {Object.entries(ROLE_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['User ID', 'Name', 'Email', 'Contact No', 'District', 'Role', 'Created At', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={8} className="px-4 py-5 text-muted">Loading users…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-5 text-muted">No users found.</td></tr>
                        ) : filtered.map(u => (
                            <tr key={u.user_id} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{u.user_id}</td>
                                <td className="px-4 py-3 font-medium text-slate">{u.fname} {u.lname}</td>
                                <td className="px-4 py-3 text-muted">{u.email}</td>
                                <td className="px-4 py-3 text-muted">{u.contact_no}</td>
                                <td className="px-4 py-3 text-muted">{u.district}</td>
                                <td className="px-4 py-3 text-muted">{ROLE_LABEL[u.role] ?? u.role}</td>
                                <td className="px-4 py-3 text-muted">{u.created_at}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => router.push(`/dashboard/admin/users/${u.user_id}/edit`)}
                                            className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => router.push(`/dashboard/admin/users/${u.user_id}`)}
                                            className="px-2.5 py-1 border border-blue-200 rounded text-[11px] text-blue-500 hover:bg-blue-50 transition-all">
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.user_id, `${u.fname} ${u.lname}`)}
                                            disabled={deletingId === u.user_id}
                                            className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                                            {deletingId === u.user_id ? 'Deleting…' : 'Delete'}
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