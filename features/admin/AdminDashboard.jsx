'use client';
import { useState } from 'react';
import { LayoutDashboard, Users, Wrench, Star, MessageSquare, Menu, X } from 'lucide-react';
import Overview from './admin-tabs/Overview';
import Users_Tab from './admin-tabs/Users';
import Providers from './admin-tabs/Providers';
import Reviews from './admin-tabs/Reviews';
import Feedback from './admin-tabs/Feedback';

const TABS = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'providers', label: 'Providers', icon: <Wrench className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" /> },
];

const TAB_CONTENT = {
    overview: <Overview />,
    users: <Users_Tab />,
    providers: <Providers />,
    reviews: <Reviews />,
    feedback: <Feedback />,
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleTab = (id) => {
        setActiveTab(id);
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col">

            {/* ── Top nav ── */}
            <nav className="h-[60px] bg-slate sticky top-0 z-50 flex items-center justify-between px-5">
                <div className="font-syne text-[1.3rem] font-extrabold tracking-tight text-amber">
                    Crew<span className="text-white">Sync</span>
                    <span className="ml-2 text-[0.65rem] font-medium text-white/40 tracking-widest uppercase align-middle">Admin</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F0E8FB] flex items-center justify-center
                        text-[#6B3FA0] text-xs font-bold">AD</div>
                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-white/70 hover:text-white"
                        onClick={() => setSidebarOpen(v => !v)}
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            <div className="flex flex-1 relative">

                {/* ── Mobile overlay ── */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* ── Sidebar ── */}
                <aside className={`
                    fixed top-[60px] left-0 h-[calc(100vh-60px)] w-[220px] bg-white border-r border-border
                    flex flex-col p-4 z-40 transition-transform duration-200
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:h-auto md:z-auto
                `}>
                    {/* Admin identity */}
                    <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-border">
                        <div className="w-9 h-9 rounded-full bg-[#F0E8FB] flex items-center justify-center
                            text-[#6B3FA0] text-xs font-bold flex-shrink-0">AD</div>
                        <div>
                            <p className="text-sm font-semibold text-slate">Admin Panel</p>
                            <p className="text-[11px] text-muted">Super Administrator</p>
                        </div>
                    </div>

                    {/* Nav items */}
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2 px-2">Manage</p>
                    <nav className="flex flex-col gap-0.5">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTab(tab.id)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                                    transition-all text-left w-full
                                    ${activeTab === tab.id
                                        ? 'bg-amber-light text-amber-dark font-semibold'
                                        : 'text-slate-light hover:bg-surface hover:text-slate'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ── Main content ── */}
                <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
                    {TAB_CONTENT[activeTab]}
                </main>
            </div>
        </div>
    );
}
