'use client';
import { useEffect, useState } from 'react';
import { Users, FolderOpen, Wrench, ArrowUpRight } from 'lucide-react';

// Fetch summary stats from your API
async function fetchStats() {
    // TODO: replace with real endpoint e.g. GET /api/admin/stats
    // const res = await fetch('/api/admin/stats');
    // return res.json();
    return {
        totalUsers: 0,
        activeProjects: 0,
        serviceProviders: 0,
        totalTransactions: 0,
        weeklyNewUsers: 0,
        userDistribution: { owners: 0, providers: 0, suppliers: 0 },
        recentActivity: [],
    };
}

export default function Overview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats().then(data => { setStats(data); setLoading(false); });
    }, []);

    if (loading) return <p className="text-sm text-muted">Loading overview…</p>;

    const total = stats.userDistribution.owners + stats.userDistribution.providers + stats.userDistribution.suppliers || 1;
    const ownerPct = Math.round((stats.userDistribution.owners / total) * 100);
    const providerPct = Math.round((stats.userDistribution.providers / total) * 100);
    const supplierPct = Math.round((stats.userDistribution.suppliers / total) * 100);

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Platform Overview</h2>
                    <p className="text-xs text-muted mt-0.5">CrewSync System Dashboard</p>
                </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                    { icon: <Users className="w-4 h-4" />, val: stats.totalUsers.toLocaleString(), lbl: 'Total Users', change: stats.weeklyNewUsers ? `↑ ${stats.weeklyNewUsers} this week` : null, up: true },
                    { icon: <FolderOpen className="w-4 h-4" />, val: stats.activeProjects.toLocaleString(), lbl: 'Active Projects' },
                    { icon: <Wrench className="w-4 h-4" />, val: stats.serviceProviders.toLocaleString(), lbl: 'Service Providers' },
                    { icon: <ArrowUpRight className="w-4 h-4" />, val: `LKR ${(stats.totalTransactions / 1_000_000).toFixed(1)}M`, lbl: 'Total Transactions' },
                ].map((m, i) => (
                    <div key={i} className="bg-white border border-border rounded-lg p-4">
                        <div className="text-muted mb-2">{m.icon}</div>
                        <div className="font-syne text-2xl font-bold text-slate">{m.val}</div>
                        <div className="text-[11px] text-muted mt-1">{m.lbl}</div>
                        {m.change && <div className={`text-[11px] mt-1 ${m.up ? 'text-green-600' : 'text-red-500'}`}>{m.change}</div>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Distribution */}
                <div className="bg-white border border-border rounded-xl p-5">
                    <h3 className="font-syne text-sm font-bold text-slate mb-4">User Distribution</h3>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: 'Property Owners', count: stats.userDistribution.owners, pct: ownerPct, color: 'bg-amber' },
                            { label: 'Service Providers', count: stats.userDistribution.providers, pct: providerPct, color: 'bg-green-600' },
                            { label: 'Material Suppliers', count: stats.userDistribution.suppliers, pct: supplierPct, color: 'bg-blue-600' },
                        ].map(row => (
                            <div key={row.label}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate">{row.label}</span>
                                    <span className="text-muted">{row.count} ({row.pct}%)</span>
                                </div>
                                <div className="h-2 bg-surface2 rounded-full">
                                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-border rounded-xl p-5">
                    <h3 className="font-syne text-sm font-bold text-slate mb-4">Recent Activity</h3>
                    {stats.recentActivity.length === 0 ? (
                        <p className="text-xs text-muted">No recent activity.</p>
                    ) : (
                        <ul className="flex flex-col divide-y divide-border">
                            {stats.recentActivity.map((item, i) => (
                                <li key={i} className="py-2.5 flex justify-between gap-2">
                                    <p className="text-xs text-slate" dangerouslySetInnerHTML={{ __html: item.message }} />
                                    <span className="text-[11px] text-muted whitespace-nowrap">{item.time}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
