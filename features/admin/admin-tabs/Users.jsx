'use client';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

// TODO: replace with real endpoint e.g. GET /api/admin/users
async function fetchUsers() {
    // const res = await fetch('/api/admin/users');
    // return res.json();
    return [];
}

const ROLE_PILL = {
    'Property Owner': 'bg-green-50 text-green-700',
    'Service Provider': 'bg-blue-50 text-blue-700',
    'Supplier': 'bg-orange-50 text-orange-700',
};

const STATUS_PILL = {
    Active: 'bg-green-50 text-green-700',
    Pending: 'bg-amber-50 text-amber-700',
    Suspended: 'bg-red-50 text-red-600',
};

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        fetchUsers().then(data => { setUsers(data); setLoading(false); });
    }, []);

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q) || u.district?.toLowerCase().includes(q);
        const matchRole = !roleFilter || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">User Management</h2>
                    <p className="text-xs text-muted mt-0.5">All registered accounts</p>
                </div>
                {/* TODO: wire up Add User modal */}
                <button className="px-4 py-2 bg-amber text-white text-xs font-semibold rounded-lg hover:bg-amber-dark transition-all">
                    + Add User
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or district…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-xs text-slate
                            bg-white focus:outline-none focus:border-amber placeholder:text-muted"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white
                        focus:outline-none focus:border-amber cursor-pointer"
                >
                    <option value="">All Roles</option>
                    <option value="Property Owner">Property Owner</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Supplier">Supplier</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                {loading ? (
                    <p className="text-xs text-muted p-5">Loading users…</p>
                ) : filtered.length === 0 ? (
                    <p className="text-xs text-muted p-5">No users found.</p>
                ) : (
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-border bg-surface text-left">
                                {['Name', 'Role', 'District', 'Joined', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 font-semibold text-slate-light uppercase tracking-wide text-[11px]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((u, i) => (
                                <tr key={i} className="hover:bg-surface transition-all">
                                    <td className="px-4 py-3 font-medium text-slate">{u.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_PILL[u.role] ?? 'bg-surface text-muted'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{u.district}</td>
                                    <td className="px-4 py-3 text-muted">{u.joinedAt}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_PILL[u.status] ?? 'bg-surface text-muted'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex gap-1.5">
                                        {/* TODO: wire Edit/Delete to API */}
                                        <button className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">Edit</button>
                                        <button className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
