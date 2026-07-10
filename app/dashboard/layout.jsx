'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, Users, Wrench, Star, MessageSquare,
    CalendarDays, FileText, Search, Package, ShoppingCart,
    UserCircle, Bell, Briefcase, Menu, X, Home,
    FolderOpen, ShoppingBag, ClipboardList, BarChart3,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV = {
    property_owner: [
        { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
        { href: '/dashboard/timeline', icon: <CalendarDays className="w-4 h-4" />, label: 'Timeline' },
        { href: '/dashboard/find-services', icon: <Search className="w-4 h-4" />, label: 'Find Services' },
        { href: '/dashboard/materials', icon: <Package className="w-4 h-4" />, label: 'Materials' },
        { href: '/dashboard/reviews', icon: <Star className="w-4 h-4" />, label: 'Reviews' },
        { href: '/dashboard/reports', icon: <FileText className="w-4 h-4" />, label: 'Reports' },
        { href: '/dashboard/notifications', icon: <Bell className="w-4 h-4" />, label: 'Notifications' },
    ],
    service_provider: [
        { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
        { href: '/dashboard/job-requests', icon: <Briefcase className="w-4 h-4" />, label: 'Job Requests' },
        { href: '/dashboard/timeline', icon: <CalendarDays className="w-4 h-4" />, label: 'Timeline' },
        { href: '/dashboard/reviews', icon: <Star className="w-4 h-4" />, label: 'Reviews' },
        { href: '/dashboard/profile', icon: <UserCircle className="w-4 h-4" />, label: 'Profile' },
    ],
    material_supplier: [
        { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
        { href: '/dashboard/my-products', icon: <Package className="w-4 h-4" />, label: 'My Products' },
        { href: '/dashboard/orders', icon: <ShoppingCart className="w-4 h-4" />, label: 'Orders' },
        { href: '/dashboard/profile', icon: <UserCircle className="w-4 h-4" />, label: 'Profile' },
    ],
    admin: [
        { href: '/dashboard/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 text-orange-500" /> },
        { href: '/dashboard/admin/users', label: 'Users', icon: <Users className="w-4 h-4 text-blue-500" /> },
        { href: '/dashboard/admin/propertyOwner', label: 'Property Owners', icon: <Home className="w-4 h-4 text-indigo-500" /> },
        { href: '/dashboard/admin/materialSupplier', label: 'Material Suppliers', icon: <Package className="w-4 h-4 text-emerald-500" /> },
        { href: '/dashboard/admin/providers', label: 'Providers', icon: <Wrench className="w-4 h-4 text-green-500" /> },
        { href: '/dashboard/admin/projects', label: 'Projects', icon: <FolderOpen className="w-4 h-4 text-cyan-500" /> },
        { href: '/dashboard/admin/reviews', label: 'Reviews', icon: <Star className="w-4 h-4 text-yellow-500" /> },
        { href: '/dashboard/admin/feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4 text-purple-500" /> },
    ],
};

const ROLE_LABEL = {
    property_owner: 'Property Owner',
    service_provider: 'Service Provider',
    material_supplier: 'Supplier',
    admin: 'Administrator',
};

const ROLE_AVATAR = {
    PROPERTY_OWNER: 'bg-orange-100 text-orange-700',
    SERVICE_PROVIDER: 'bg-green-100 text-green-700',
    MATERIAL_SUPPLIER: 'bg-blue-100 text-blue-700',
    ADMIN: 'bg-purple-100 text-purple-700',
};

const ROLE_DOT = {
    PROPERTY_OWNER: 'bg-orange-500',
    SERVICE_PROVIDER: 'bg-green-500',
    MATERIAL_SUPPLIER: 'bg-blue-500',
    ADMIN: 'bg-purple-500',
};

export default function DashboardLayout({ children }) {
    const { user, role, logout } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (pathname.startsWith('/dashboard/propertyowner')) {
        return <>{children}</>;
    }

    const navItems = NAV[role] ?? NAV.property_owner;
    const initials = user?.avatar || 'U';
    return (
        <div className="flex h-full">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed top-[60px] left-0 h-[calc(100vh-60px)] w-[230px] bg-white border-r border-border
                flex flex-col p-4 z-40 transition-transform duration-200 overflow-y-auto
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:h-auto md:z-auto
            `}>

                {/* User card */}
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-border">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ROLE_AVATAR[role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate truncate">{user?.fname ?? 'User'}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ROLE_DOT[role] ?? 'bg-gray-400'}`} />
                            <p className="text-[11px] text-muted truncate">{ROLE_LABEL[role] ?? 'User'}</p>
                        </div>
                    </div>
                </div>

                {/* Nav sections */}
                <nav className="flex flex-col gap-4 flex-1">
                    {sections.map(({ section, items }) => (
                        <div key={section}>
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-1.5 px-2">
                                {section}
                            </p>
                            <div className="flex flex-col gap-0.5">
                                {items.map(item => {
                                    const Icon = item.icon;
                                    const active = pathname === item.href ||
                                        (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-2 py-2 rounded-xl text-sm transition-all
                                                ${active
                                                    ? 'bg-orange-50 text-orange-600 font-semibold'
                                                    : 'text-slate-light hover:bg-surface hover:text-slate'
                                                }`}
                                        >
                                            {/* Icon box */}
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                                                <Icon size={16} className={item.iconColor} strokeWidth={2.2} />
                                            </div>
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sign out */}
                <button
                    onClick={logout}
                    className="mt-4 w-full text-left px-3 py-2 rounded-xl text-sm text-muted hover:bg-red-50 hover:text-red-500 transition-all"
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