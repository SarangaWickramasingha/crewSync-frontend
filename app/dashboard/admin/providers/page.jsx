'use client';
import { Star } from 'lucide-react';
import StatusPill from '@/Components/ui/StatusPill';

// ── Sample data (replace with API calls when backend is ready) ──
// TODO: fetch from GET /api/admin/providers
const SAMPLE_PROVIDERS = [
    { name: 'Sunil Karunaratne', skill: 'Mason', rating: 4.9, jobsDone: 156, status: 'Verified' },
    { name: 'Ruwan Perera', skill: 'Electrician', rating: 4.7, jobsDone: 89, status: 'Verified' },
    { name: 'Dinesh Wickrama', skill: 'Carpenter', rating: 4.8, jobsDone: 112, status: 'Verified' },
    { name: 'Janaka Silva', skill: 'Plumber', rating: 3.9, jobsDone: 22, status: 'Under Review' },
];

export default function AdminProvidersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Service Providers</h2>
                    <p className="text-xs text-muted mt-0.5">Monitor and verify professionals</p>
                </div>
            </div>

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
                        {SAMPLE_PROVIDERS.map((p, i) => (
                            <tr key={i} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 font-medium text-slate">{p.name}</td>
                                <td className="px-4 py-3 text-muted">{p.skill}</td>
                                <td className="px-4 py-3">
                                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        {p.rating.toFixed(1)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted">{p.jobsDone}</td>
                                <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                                <td className="px-4 py-3 flex gap-1.5">
                                    {/* TODO: wire to API */}
                                    <button className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">View</button>
                                    {p.status !== 'Suspended' && (
                                        <button className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all">Suspend</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
