'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, Users, Wrench, Star, MessageSquare,
    CalendarDays, MessageCircle, FileText, Search, Package,
    ShoppingCart, UserCircle, Bell, Briefcase, Menu, X, Home
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';



// ── Sidebar nav per role ──────────────────────────────────────────
const NAV = {
    PROPERTY_OWNER: [
        { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
        { href: '/dashboard/timeline', icon: <CalendarDays className="w-4 h-4" />, label: 'Timeline' },
        { href: '/dashboard/find-services', icon: <Search className="w-4 h-4" />, label: 'Find Services' },
        { href: '/dashboard/materials', icon: <Package className="w-4 h-4" />, label: 'Materials' },
        { href: '/dashboard/reviews', icon: <Star className="w-4 h-4" />, label: 'Reviews' },
        { href: '/dashboard/reports', icon: <FileText className="w-4 h-4" />, label: 'Reports' },
        { href: '/dashboard/notifications', icon: <Bell className="w-4 h-4" />, label: 'Notifications' },
    ],
    SERVICE_PROVIDER: [
        { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
        { href: '/dashboard/job-requests', icon: <Briefcase className="w-4 h-4" />, label: 'Job Requests' },
        { href: '/dashboard/timeline', icon: <CalendarDays className="w-4 h-4" />, label: 'Timeline' },
        { href: '/dashboard/reviews', icon: <Star className="w-4 h-4" />, label: 'Reviews' },
        { href: '/dashboard/profile', icon: <UserCircle className="w-4 h-4" />, label: 'Profile' },
    ],
    MATERIAL_SUPPLIER: [
        { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
        { href: '/dashboard/my-products', icon: <Package className="w-4 h-4" />, label: 'My Products' },
        { href: '/dashboard/orders', icon: <ShoppingCart className="w-4 h-4" />, label: 'Orders' },
        { href: '/dashboard/profile', icon: <UserCircle className="w-4 h-4" />, label: 'Profile' },
    ],
    ADMIN: [
        { href: '/dashboard/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 text-orange-500" /> },
        { href: '/dashboard/admin/users', label: 'Users', icon: <Users className="w-4 h-4 text-blue-500" /> },
        { href: '/dashboard/admin/propertyOwner', label: 'Property Owners', icon: <Home className="w-4 h-4 text-indigo-500" /> },
        { href: '/dashboard/admin/materialSupplier', label: 'Material Suppliers', icon: <Package className="w-4 h-4 text-emerald-500" /> },
        { href: '/dashboard/admin/providers', label: 'Providers', icon: <Wrench className="w-4 h-4 text-green-500" /> },
        { href: '/dashboard/admin/reviews', label: 'Reviews', icon: <Star className="w-4 h-4 text-yellow-500" /> },
        { href: '/dashboard/admin/feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4 text-purple-500" /> },
    ],
};

const ROLE_LABEL = {
    PROPERTY_OWNER: 'Property Owner',
    SERVICE_PROVIDER: 'Service Provider',
    MATERIAL_SUPPLIER: 'Supplier',
    ADMIN: 'Administrator',
};

export default function DashboardLayout({ children }) {
    const { user, role, logout } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = NAV[role] ?? NAV.PROPERTY_OWNER;
    const initials = user?.fname ? user.fname.slice(0, 2).toUpperCase() : 'U';

    return (
        <div className="flex h-full">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed top-[60px] left-0 h-[calc(100vh-60px)] w-[220px] bg-white border-r border-border
                flex flex-col p-4 z-40 transition-transform duration-200
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:h-auto md:z-auto
            `}>
                {/* User identity */}
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-border">
                    <div className="w-9 h-9 rounded-full bg-amber/10 flex items-center justify-center
                        text-amber text-xs font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate truncate max-w-[130px]">
                            {user?.fname ?? 'User'}
                        </p>
                        <p className="text-[11px] text-muted">{ROLE_LABEL[role] ?? 'User'}</p>
                    </div>
                </div>

                {/* Nav */}
                <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2 px-2">Menu</p>
                <nav className="flex flex-col gap-0.5 flex-1">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
    ${pathname === item.href
                                    ? 'bg-surface font-semibold text-slate shadow-sm border border-border'
                                    : 'text-slate-light hover:bg-surface hover:text-slate'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="mt-4 w-full text-left px-3 py-2 rounded-lg text-sm text-muted hover:bg-surface hover:text-red-500 transition-all"
                >
                    Sign Out
                </button>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-border">
                    <button onClick={() => setSidebarOpen(v => !v)} className="text-slate">
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <span className="font-syne font-bold text-slate text-sm">Dashboard</span>
                </div>

                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface">
                    {children}
                </main>
            </div>
        </div>
    );
}
