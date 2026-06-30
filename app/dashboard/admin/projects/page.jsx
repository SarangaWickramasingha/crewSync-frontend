'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import StatusPill from '@/Components/ui/StatusPill';

// TODO: fetch from GET /api/admin/projects
const SAMPLE_PROJECTS = [
    { project_id: 1, owner_id: 1, owner_name: 'Nimal Kumarasinghe', project_name: 'Two-Story House Construction', location: 'Kandy', budget: 4500000, start_date: '2026-01-10', end_date: '2026-08-15', status: 'active' },
    { project_id: 2, owner_id: 4, owner_name: 'Chamari Perera', project_name: 'Roof Renovation', location: 'Matale', budget: 850000, start_date: '2026-03-01', end_date: '2026-04-20', status: 'completed' },
    { project_id: 3, owner_id: 1, owner_name: 'Nimal Kumarasinghe', project_name: 'Garden Landscaping', location: 'Kandy', budget: 320000, start_date: '2026-05-05', end_date: '2026-06-30', status: 'planning' },
    { project_id: 4, owner_id: 7, owner_name: 'Roshan Fernando', project_name: 'Office Building Extension', location: 'Colombo', budget: 12000000, start_date: '2025-11-01', end_date: '2026-12-01', status: 'on_hold' },
];

const STATUS_LABEL = {
    planning: 'Planning',
    active: 'Active',
    on_hold: 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const STATUS_STYLE = {
    planning: 'bg-blue-50 text-blue-700',
    active: 'bg-green-50 text-green-700',
    on_hold: 'bg-amber-50 text-amber-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-50 text-red-600',
};

export default function AdminProjectsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filtered = SAMPLE_PROJECTS.filter(p => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.project_name.toLowerCase().includes(q) || p.owner_name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
        const matchStatus = !statusFilter || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Projects</h2>
                    <p className="text-xs text-muted mt-0.5">All construction projects on the platform</p>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by project name, owner, or location…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-xs text-slate
                            bg-white focus:outline-none focus:border-amber placeholder:text-muted"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer"
                >
                    <option value="">All Status</option>
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['Project ID', 'Project Name', 'Owner', 'Location', 'Budget', 'Start Date', 'End Date', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={9} className="px-4 py-5 text-muted">No projects found.</td></tr>
                        ) : filtered.map((p) => (
                            <tr key={p.project_id} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{p.project_id}</td>
                                <td className="px-4 py-3 font-medium text-slate">{p.project_name}</td>
                                <td className="px-4 py-3 text-muted">{p.owner_name}</td>
                                <td className="px-4 py-3 text-muted">{p.location}</td>
                                <td className="px-4 py-3 text-muted">LKR {p.budget.toLocaleString()}</td>
                                <td className="px-4 py-3 text-muted">{p.start_date}</td>
                                <td className="px-4 py-3 text-muted">{p.end_date}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[p.status]}`}>
                                        {STATUS_LABEL[p.status]}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => router.push(`/dashboard/admin/projects/${p.project_id}`)}
                                        className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
