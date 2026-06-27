'use client';
import { Users, FolderOpen, Wrench, TrendingUp } from 'lucide-react';

// ── Sample data (replace with API calls when backend is ready) ──
// TODO: fetch from GET /api/admin/stats
const STATS = [
    { icon: <Users className="w-4 h-4" />, val: '1,248', lbl: 'Total Users', change: '↑ 24 this week', up: true },
    { icon: <FolderOpen className="w-4 h-4" />, val: '86', lbl: 'Active Projects', change: '↑ 6 this week', up: true },
    { icon: <Wrench className="w-4 h-4" />, val: '340', lbl: 'Service Providers', change: null },
    { icon: <TrendingUp className="w-4 h-4" />, val: 'LKR 4.2M', lbl: 'Total Transactions', change: null },
];

const USER_DIST = [
    { label: 'Property Owners', count: 620, pct: 50, color: 'bg-amber-500' },
    { label: 'Service Providers', count: 340, pct: 27, color: 'bg-green-600' },
    { label: 'Material Suppliers', count: 288, pct: 23, color: 'bg-blue-600' },
];

const RECENT = [
    { msg: '<b>Nimal K.</b> registered as Property Owner', time: '2 min ago' },
    { msg: '<b>Sunil K.</b> completed a job in Kandy', time: '18 min ago' },
    { msg: '<b>Malshan Hardware</b> added 3 new products', time: '1 hr ago' },
    { msg: 'Review flagged by user on <b>Janaka S.</b>', time: '2 hr ago' },
    { msg: '<b>Chamari P.</b> submitted feedback', time: '3 hr ago' },
];

export default function AdminOverviewPage() {
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
                {STATS.map((s, i) => (
                    <div key={i} className="bg-white border border-border rounded-lg p-4">
                        <div className="text-muted mb-2">{s.icon}</div>
                        <div className="font-syne text-2xl font-bold text-slate">{s.val}</div>
                        <div className="text-[11px] text-muted mt-1">{s.lbl}</div>
                        {s.change && (
                            <div className={`text-[11px] mt-1 ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                                {s.change}
                            </div>
                        )}
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
                    <ul className="flex flex-col divide-y divide-border">
                        {RECENT.map((item, i) => (
                            <li key={i} className="py-2.5 flex justify-between gap-2">
                                <p className="text-xs text-slate" dangerouslySetInnerHTML={{ __html: item.msg }} />
                                <span className="text-[11px] text-muted whitespace-nowrap">{item.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
