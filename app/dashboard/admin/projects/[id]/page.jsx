'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Wallet, User } from 'lucide-react';

// TODO: fetch from GET /api/admin/projects/:id
const SAMPLE_PROJECTS = {
    1: {
        project_id: 1, owner_id: 1, owner_name: 'Nimal Kumarasinghe',
        project_name: 'Two-Story House Construction', location: 'Kandy',
        budget: 4500000, start_date: '2026-01-10', end_date: '2026-08-15', status: 'active',
        tasks: [
            { task_id: 1, task_name: 'Foundation Work', description: 'Excavation and foundation laying', start_date: '2026-01-10', end_date: '2026-02-15', status: 'completed', priority: 'high', cost: 850000, provider_name: 'Sunil Karunaratne' },
            { task_id: 2, task_name: 'Wall Construction', description: 'Brick wall construction for ground floor', start_date: '2026-02-16', end_date: '2026-04-10', status: 'in_progress', priority: 'high', cost: 1200000, provider_name: 'Sunil Karunaratne' },
            { task_id: 3, task_name: 'Electrical Wiring', description: 'Complete house wiring', start_date: '2026-04-11', end_date: '2026-05-20', status: 'pending', priority: 'medium', cost: 600000, provider_name: 'Ruwan Perera' },
            { task_id: 4, task_name: 'Plumbing', description: 'Water supply and drainage', start_date: '2026-04-11', end_date: '2026-05-20', status: 'pending', priority: 'medium', cost: 450000, provider_name: null },
        ],
    },
    2: {
        project_id: 2, owner_id: 4, owner_name: 'Chamari Perera',
        project_name: 'Roof Renovation', location: 'Matale',
        budget: 850000, start_date: '2026-03-01', end_date: '2026-04-20', status: 'completed',
        tasks: [
            { task_id: 5, task_name: 'Old Roof Removal', description: 'Remove damaged roofing sheets', start_date: '2026-03-01', end_date: '2026-03-10', status: 'completed', priority: 'high', cost: 150000, provider_name: 'Dinesh Wickrama' },
            { task_id: 6, task_name: 'New Roof Installation', description: 'Install new roofing sheets', start_date: '2026-03-11', end_date: '2026-04-15', status: 'completed', priority: 'high', cost: 700000, provider_name: 'Dinesh Wickrama' },
        ],
    },
};

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
    const project = SAMPLE_PROJECTS[id];

    if (!project) return (
        <div className="text-center py-20">
            <p className="text-muted text-sm">Project not found.</p>
            <button onClick={() => router.back()} className="mt-4 text-amber text-sm hover:underline">← Go back</button>
        </div>
    );

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
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${PROJECT_STATUS_STYLE[project.status]}`}>
                    {PROJECT_STATUS_LABEL[project.status]}
                </span>
            </div>

            {/* Project Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <InfoCard icon={<User className="w-4 h-4" />} label="Owner" value={project.owner_name} />
                <InfoCard icon={<MapPin className="w-4 h-4" />} label="Location" value={project.location} />
                <InfoCard icon={<Wallet className="w-4 h-4" />} label="Budget" value={`LKR ${project.budget.toLocaleString()}`} />
                <InfoCard icon={<Calendar className="w-4 h-4" />} label="Timeline" value={`${project.start_date} → ${project.end_date}`} />
            </div>

            {/* Tasks */}
            <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-surface">
                    <h3 className="font-syne text-sm font-bold text-slate">Tasks ({project.tasks.length})</h3>
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
                            {project.tasks.map(t => (
                                <tr key={t.task_id} className="hover:bg-surface transition-all">
                                    <td className="px-4 py-3 text-muted">{t.task_id}</td>
                                    <td className="px-4 py-3 font-medium text-slate">{t.task_name}</td>
                                    <td className="px-4 py-3 text-muted max-w-[180px] truncate">{t.description}</td>
                                    <td className="px-4 py-3 text-muted">{t.start_date}</td>
                                    <td className="px-4 py-3 text-muted">{t.end_date}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${PRIORITY_STYLE[t.priority]}`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">LKR {t.cost.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-muted">{t.provider_name ?? '— Unassigned —'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TASK_STATUS_STYLE[t.status]}`}>
                                            {TASK_STATUS_LABEL[t.status]}
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
