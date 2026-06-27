'use client';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

// TODO: replace with real endpoint e.g. GET /api/admin/providers
async function fetchProviders() {
    // const res = await fetch('/api/admin/providers');
    // return res.json();
    return [];
}

const STATUS_PILL = {
    Verified: 'bg-green-50 text-green-700',
    'Under Review': 'bg-amber-50 text-amber-700',
    Suspended: 'bg-red-50 text-red-600',
};

export default function Providers() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProviders().then(data => { setProviders(data); setLoading(false); });
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Service Providers</h2>
                    <p className="text-xs text-muted mt-0.5">Monitor and verify professionals</p>
                </div>
            </div>

            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                {loading ? (
                    <p className="text-xs text-muted p-5">Loading providers…</p>
                ) : providers.length === 0 ? (
                    <p className="text-xs text-muted p-5">No service providers found.</p>
                ) : (
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-border bg-surface text-left">
                                {['Name', 'Skill', 'Rating', 'Jobs Done', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 font-semibold text-slate-light uppercase tracking-wide text-[11px]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {providers.map((p, i) => (
                                <tr key={i} className="hover:bg-surface transition-all">
                                    <td className="px-4 py-3 font-medium text-slate">{p.name}</td>
                                    <td className="px-4 py-3 text-muted">{p.skill}</td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            {p.rating?.toFixed(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{p.jobsDone}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_PILL[p.status] ?? 'bg-surface text-muted'}`}>
                                            {p.status}
                                        </span>
                                    </td>
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
                )}
            </div>
        </div>
    );
}
