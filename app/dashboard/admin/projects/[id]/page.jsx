'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Wallet, User } from 'lucide-react';

// Move this to a shared file (e.g. @/lib/api.js) and import it on every page.
const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    'http://localhost/CrewSync-backend/backend/index.php';

const PROJECT_STATUS_LABEL = {
    planning: 'Planning', active: 'Active', on_hold: 'On Hold', completed: 'Completed', cancelled: 'Cancelled',
};
const PROJECT_STATUS_STYLE = {
    planning: 'bg-blue-50 text-blue-700', active: 'bg-green-50 text-green-700',
    on_hold: 'bg-amber-50 text-amber-700', completed: 'bg-gray-100 text-gray-600', cancelled: 'bg-red-50 text-red-600',
};

const TASK_STATUS_LABEL = {
    pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled',
};
const TASK_STATUS_STYLE = {
    pending: 'bg-gray-100 text-gray-600', in_progress: 'bg-blue-50 text-blue-700',
    completed: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-600',
};

const PRIORITY_STYLE = {
    low: 'bg-gray-100 text-gray-600', medium: 'bg-amber-50 text-amber-700', high: 'bg-red-50 text-red-600',
};

const FALLBACK_PILL = 'bg-gray-100 text-gray-600';

function money(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n.toLocaleString() : '—';
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5 bg-white border border-border rounded-xl p-3">
            <div className="w-8 h-8 rounded-lg bg-amber/10 text-amber flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[11px] text-muted">{label}</p>
                <p className="text-sm font-semibold text-slate">{value}</p>
            </div>
        </div>
    );
}

export default function AdminProjectViewPage() {
    const { id } = useParams();
    const router = useRouter();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();

        setLoading(true);
        fetch(`${API_BASE}/api/admin/projects/${id}`, {
            credentials: 'include',
            signal: controller.signal,
        })
            .then(res => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then(data => {
                if (!data.success) throw new Error(data.message || 'Could not load this project.');
                setProject(data.project);
            })
            .catch(err => {
                if (err.name !== 'AbortError') setError(err.message);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [id]);

    if (loading) return <p className="text-xs text-muted p-6">Loading…</p>;

    if (error || !project) return (
        <div className="text-center py-20">
            <p className="text-muted text-sm">{error || 'Project not found.'}</p>
            <button onClick={() => router.back()} className="mt-4 text-amber text-sm hover:underline">← Go back</button>
        </div>
    );

    const tasks = project.tasks ?? [];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()}
                        className="p-2 rounded-lg border border-border hover:bg-surface transition-all">
                        <ArrowLeft className="w-4 h-4 text-slate" />
                    </button>
                    <div>
                        <h2 className="font-syne text-xl font-bold text-slate">{project.project_name}</h2>
                        <p className="text-xs text-muted mt-0.5">Project ID: #{project.project_id}</p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${PROJECT_STATUS_STYLE[project.status] ?? FALLBACK_PILL}`}>
                    {PROJECT_STATUS_LABEL[project.status] ?? project.status}
                </span>
            </div>

            {/* Project Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <InfoCard icon={<User className="w-4 h-4" />} label="Owner" value={project.owner_name ?? '—'} />
                <InfoCard icon={<MapPin className="w-4 h-4" />} label="Location" value={project.location ?? '—'} />
                <InfoCard icon={<Wallet className="w-4 h-4" />} label="Budget" value={`LKR ${money(project.budget)}`} />
                <InfoCard icon={<Calendar className="w-4 h-4" />} label="Timeline" value={`${project.start_date ?? '—'} → ${project.end_date ?? '—'}`} />
            </div>

            {/* Tasks */}
            <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-surface">
                    <h3 className="font-syne text-sm font-bold text-slate">Tasks ({tasks.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-border bg-[#1A1D23] text-left">
                                {['Task ID', 'Task Name', 'Description', 'Start Date', 'End Date', 'Priority', 'Cost', 'Assigned Provider', 'Status'].map(h => (
                                    <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {tasks.length === 0 ? (
                                <tr><td colSpan={9} className="px-4 py-5 text-muted">No tasks on this project yet.</td></tr>
                            ) : tasks.map(t => (
                                <tr key={t.task_id} className="hover:bg-surface transition-all">
                                    <td className="px-4 py-3 text-muted">{t.task_id}</td>
                                    <td className="px-4 py-3 font-medium text-slate">{t.task_name}</td>
                                    <td className="px-4 py-3 text-muted max-w-[180px] truncate">{t.description}</td>
                                    <td className="px-4 py-3 text-muted">{t.start_date}</td>
                                    <td className="px-4 py-3 text-muted">{t.end_date}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${PRIORITY_STYLE[t.priority] ?? FALLBACK_PILL}`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">LKR {money(t.cost)}</td>
                                    <td className="px-4 py-3 text-muted">{t.provider_name ?? '— Unassigned —'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TASK_STATUS_STYLE[t.status] ?? FALLBACK_PILL}`}>
                                            {TASK_STATUS_LABEL[t.status] ?? t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}