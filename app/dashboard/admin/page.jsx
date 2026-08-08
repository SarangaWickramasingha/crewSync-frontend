'use client';

import { useAuth } from '@/context/AuthContext';
import { Users, FolderOpen, Wrench, TrendingUp } from 'lucide-react';
import { useAdminStats } from '@/src/hooks/admin/useAdmin';

/** PHP/MySQL often returns numeric columns as strings — coerce before any maths. */
const num = value => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

export default function AdminOverviewPage() {
    const { user } = useAuth();
    const { data: stats, isPending: loading, error } = useAdminStats();

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    if (loading) return <p className="text-xs text-muted p-6">Loading…</p>;
    if (error || !stats?.data) return <p className="text-xs text-red-500 p-6">{error?.message || 'Failed to load stats.'}</p>;

    // Everything below reads `stats.data`, so it has to come after the guards above.
    const statsData = stats.data;
    const dist = statsData.userDistribution ?? {};
    const owners = num(dist.owners);
    const providers = num(dist.providers);
    const suppliers = num(dist.suppliers);
    const total = owners + providers + suppliers || 1;

    const STATS_DATA = [
        {
            icon: <Users className="w-7 h-7" />,
            val: num(statsData.totalUsers).toLocaleString(),
            lbl: 'Total Users',
            change: statsData.newUsersThisWeek ? `↑ ${num(statsData.newUsersThisWeek)} this week` : null,
            up: true,
        },
        {
            icon: <FolderOpen className="w-7 h-7" />,
            val: num(statsData.activeProjects).toLocaleString(),
            lbl: 'Active Projects',
            change: null,
        },
        {
            icon: <Wrench className="w-7 h-7" />,
            val: num(statsData.serviceProviders).toLocaleString(),
            lbl: 'Service Providers',
            change: null,
        },
        {
            icon: <TrendingUp className="w-7 h-7" />,
            val: `LKR ${(num(statsData.totalTransactions) / 1_000_000).toFixed(1)}M`,
            lbl: 'Total Transactions',
            change: null,
        },
    ];

    const USER_DIST = [
        { label: 'Property Owners', count: owners, pct: Math.round((owners / total) * 100), color: 'bg-amber-500' },
        { label: 'Service Providers', count: providers, pct: Math.round((providers / total) * 100), color: 'bg-green-600' },
        { label: 'Material Suppliers', count: suppliers, pct: Math.round((suppliers / total) * 100), color: 'bg-blue-600' },
    ];

    return (
        <div>
            {/* Greeting */}
            <div className="mb-6">
                <h2 className="font-syne text-2xl font-bold text-slate">
                    {greeting}, {user?.fname ?? 'Admin'} 👋
                </h2>
                <p className="text-xs text-muted mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · CrewSync System Dashboard
                </p>
            </div>



            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {STATS_DATA.map(s => (
                    <div key={s.lbl} className="relative flex items-center gap-4 p-4 rounded-xl overflow-hidden"
                        style={{
                            background: 'white',
                            border: '2px solid #1A1D23',
                            boxShadow: '0 2px 8px rgba(26,29,35,0.08)',
                        }}
                    >
                        <div className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(232,130,12,0.15)', border: '1px solid rgba(232,130,12,0.25)' }}>
                            <span className="text-[#E8820C]">{s.icon}</span>
                        </div>
                        <div className="relative z-10">
                            <div className="font-syne text-2xl font-bold text-slate">{s.val}</div>
                            <div className="text-[11px] text-muted mt-0.5">{s.lbl}</div>
                            {s.change && (
                                <div className={`text-[11px] mt-1 ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                                    {s.change}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Distribution */}
                <div className="bg-white border border-border rounded-xl p-5">
                    <h3 className="font-syne text-sm font-bold text-slate mb-4">User Distribution</h3>
                    <div className="flex flex-col gap-3">
                        {USER_DIST.map(row => (
                            <div key={row.label}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate">{row.label}</span>
                                    <span className="text-muted">{row.count} ({row.pct}%)</span>
                                </div>
                                <div className="h-2 bg-surface rounded-full">
                                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-border rounded-xl p-5">
                    <h3 className="font-syne text-sm font-bold text-slate mb-4">Recent Activity</h3>
                    <p className="text-xs text-muted">No recent activity available yet.</p>
                </div>
            </div>
        </div>
    );
}
