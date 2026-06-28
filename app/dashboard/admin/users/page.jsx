'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import StatusPill from '@/Components/ui/StatusPill';

// ── Sample data (replace with API calls when backend is ready) ──
// TODO: fetch from GET /api/admin/users
const SAMPLE_USERS = [
    { name: 'Nimal Kumarasinghe', role: 'Property Owner', district: 'Kandy', joined: 'Jan 2026', status: 'Active' },
    { name: 'Sunil Karunaratne', role: 'Service Provider', district: 'Kandy', joined: 'Feb 2026', status: 'Active' },
    { name: 'Malshan Hardware', role: 'Supplier', district: 'Kandy', joined: 'Mar 2026', status: 'Active' },
    { name: 'Chamari Perera', role: 'Property Owner', district: 'Matale', joined: 'May 2026', status: 'Pending' },
    { name: 'Dinesh Wickrama', role: 'Service Provider', district: 'Kandy', joined: 'Apr 2026', status: 'Active' },
];

export default function AdminUsersPage() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const filtered = SAMPLE_USERS.filter(u => {
        const q = search.toLowerCase();
        const matchSearch = !q || u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.district.toLowerCase().includes(q);
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
                    className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer"
                >
                    <option value="">All Roles</option>
                    <option value="Property Owner">Property Owner</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Supplier">Supplier</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['Name', 'Role', 'District', 'Joined', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-5 text-muted">No users found.</td></tr>
                        ) : filtered.map((u, i) => (
                            <tr key={i} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 font-medium text-slate">{u.name}</td>
                                <td className="px-4 py-3 text-muted">{u.role}</td>
                                <td className="px-4 py-3 text-muted">{u.district}</td>
                                <td className="px-4 py-3 text-muted">{u.joined}</td>
                                <td className="px-4 py-3"><StatusPill status={u.status} /></td>
                                <td className="px-4 py-3 flex gap-1.5">
                                    {/* TODO: wire Edit/Delete to API */}
                                    <button className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">Edit</button>
                                    <button className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
