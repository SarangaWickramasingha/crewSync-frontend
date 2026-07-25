'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    'http://localhost/CrewSync-backend/backend/index.php';

const STATUS_LABEL = {
    planning: 'Planning',
    active: 'Active',
    on_hold: 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const STATUS_STYLE = {
    planning: 'bg-slate-100 text-slate-700',
    active: 'bg-emerald-100 text-emerald-700',
    on_hold: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-rose-100 text-rose-700',
};

const FALLBACK_PILL = 'bg-slate-100 text-slate-700';

const formatBudget = value => {
    if (value === null || value === undefined || value === '') return '—';
    const n = Number(value);
    return Number.isFinite(n) ? n.toLocaleString() : '—';
};

export default function AdminProjectsPage() {
    const router = useRouter();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        fetch(`${API_BASE}/api/admin/projects`, {
            credentials: 'include',
            signal: controller.signal,
        })
            .then(res => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then(data => {
                if (!data.success) throw new Error(data.message || 'Could not load projects.');
                setProjects(data.projects ?? []);
            })
            .catch(err => {
                if (err.name !== 'AbortError') setError(err.message);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    const filtered = projects.filter(p => {
        const q = search.trim().toLowerCase();
        const matchSearch =
            !q ||
            (p.project_name ?? '').toLowerCase().includes(q) ||
            (p.owner_name ?? '').toLowerCase().includes(q) ||
            (p.location ?? '').toLowerCase().includes(q);
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
                    {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
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
                        {loading ? (
                            <tr><td colSpan={9} className="px-4 py-5 text-muted">Loading projects…</td></tr>
                        ) : error ? (
                            <tr><td colSpan={9} className="px-4 py-5 text-rose-600">{error}</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={9} className="px-4 py-5 text-muted">No projects found.</td></tr>
                        ) : filtered.map(p => (
                            <tr key={p.project_id} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{p.project_id}</td>
                                <td className="px-4 py-3 font-medium text-slate">{p.project_name}</td>
                                <td className="px-4 py-3 text-muted">{p.owner_name}</td>
                                <td className="px-4 py-3 text-muted">{p.location}</td>
                                <td className="px-4 py-3 text-muted">LKR {formatBudget(p.budget)}</td>
                                <td className="px-4 py-3 text-muted">{p.start_date}</td>
                                <td className="px-4 py-3 text-muted">{p.end_date}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[p.status] ?? FALLBACK_PILL}`}>
                                        {STATUS_LABEL[p.status] ?? p.status}
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