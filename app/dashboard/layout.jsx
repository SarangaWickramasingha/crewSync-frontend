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
import Navbar from '@/src/components/layout/Navbar';
import { useOrders } from '@/src/hooks/supplier/useSupplierOrders';

const NAV = {
    PROPERTY_OWNER: [
        {
            section: 'Main',
            items: [
                { href: '/dashboard', icon: LayoutDashboard, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', label: 'Overview' },
                { href: '/dashboard/timeline', icon: CalendarDays, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', label: 'Timeline' },
                { href: '/dashboard/find-services', icon: Search, iconBg: 'bg-green-50', iconColor: 'text-green-600', label: 'Find Services' },
                { href: '/dashboard/materials', icon: Package, iconBg: 'bg-orange-50', iconColor: 'text-orange-600', label: 'Materials' },
                { href: '/dashboard/notifications', icon: Bell, iconBg: 'bg-pink-50', iconColor: 'text-pink-600', label: 'Notifications' },
            ],
        },
        {
            section: 'Insights',
            items: [
                { href: '/dashboard/reviews', icon: Star, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600', label: 'Reviews' },
                { href: '/dashboard/reports', icon: BarChart3, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: 'Reports' },
                { href: '/dashboard/profile', icon: UserCircle, iconBg: 'bg-slate-100', iconColor: 'text-slate-600', label: 'Profile' },
            ],
        },
    ],

    SERVICE_PROVIDER: [
        {
            section: 'Dashboard',
            items: [
                { href: '/dashboard/serviceprovider', icon: LayoutDashboard, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', label: 'Overview' },
                { href: '/dashboard/serviceprovider/job-requests', icon: Briefcase, iconBg: 'bg-green-50', iconColor: 'text-green-600', label: 'Job Requests', badge: '4' },
                { href: '/dashboard/serviceprovider/timeline', icon: CalendarDays, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', label: 'Timeline' },
                { href: '/dashboard/serviceprovider/forum', icon: MessageSquare, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: 'Forum' },
                { href: '/dashboard/serviceprovider/reviews', icon: Star, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600', label: 'Reviews' },
                { href: '/dashboard/serviceprovider/profile', icon: UserCircle, iconBg: 'bg-sky-50', iconColor: 'text-sky-600', label: 'Profile' },
            ],
        },
    ],

    MATERIAL_SUPPLIER: [
        {
            section: 'Store',
            items: [
                { href: '/dashboard/supplier/my-products', icon: ShoppingBag, iconBg: 'bg-orange-50', iconColor: 'text-orange-600', label: 'My Products' },
                { href: '/dashboard/supplier/orders', icon: ClipboardList, iconBg: 'bg-green-50', iconColor: 'text-green-600', label: 'Orders', dynamicBadgeKey: 'supplierOrders' },
            ],
        },
        {
            section: 'Account',
            items: [
                { href: '/dashboard/supplier/profile', icon: UserCircle, iconBg: 'bg-slate-100', iconColor: 'text-slate-600', label: 'Profile' },
            ],
        },
    ],

    ADMIN: [
        {
            section: 'Overview',
            items: [
                { href: '/dashboard/admin', icon: LayoutDashboard, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', label: 'Overview' },
            ],
        },
        {
            section: 'Users',
            items: [
                { href: '/dashboard/admin/users', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', label: 'All Users' },
                { href: '/dashboard/admin/propertyOwner', icon: Home, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', label: 'Property Owners' },
                { href: '/dashboard/admin/providers', icon: Wrench, iconBg: 'bg-green-50', iconColor: 'text-green-500', label: 'Providers' },
                { href: '/dashboard/admin/materialSupplier', icon: Package, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', label: 'Suppliers' },
            ],
        },
        {
            section: 'Content',
            items: [
                { href: '/dashboard/admin/projects', icon: FolderOpen, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-500', label: 'Projects' },
                { href: '/dashboard/admin/reviews', icon: Star, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500', label: 'Reviews' },
                { href: '/dashboard/admin/feedback', icon: MessageSquare, iconBg: 'bg-purple-50', iconColor: 'text-purple-500', label: 'Feedback' },
            ],
        },
    ],
};

const ROLE_LABEL = {
    PROPERTY_OWNER: 'Property Owner',
    SERVICE_PROVIDER: 'Service Provider',
    MATERIAL_SUPPLIER: 'Supplier',
    ADMIN: 'Administrator',
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

    const isSupplier = (role ?? '').toUpperCase() === 'MATERIAL_SUPPLIER';
    const { data: supplierOrders = [] } = useOrders({ enabled: isSupplier });
    const supplierOrdersCount = supplierOrders.length;

    // Guest (not logged in) pages render their own navbar/sidebar
    if (!user) {
        return <>{children}</>;
    }

    // These pages have their own built-in navbar/sidebar — don't double-wrap them
    if (pathname.startsWith('/dashboard/propertyowner')) {
        return <>{children}</>;
    }

    const roleKey = (role ?? '').toUpperCase();
    const sections = NAV[roleKey] ?? NAV.PROPERTY_OWNER;

    const displayName = user?.name ?? user?.fname ?? 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <>
            <Navbar />
            <div className="flex h-[calc(100vh-60px)]">

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
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ROLE_AVATAR[roleKey] ?? 'bg-gray-100 text-gray-600'}`}>
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate truncate">{displayName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ROLE_DOT[roleKey] ?? 'bg-gray-400'}`} />
                                <p className="text-[11px] text-muted truncate">{ROLE_LABEL[roleKey] ?? 'User'}</p>
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
                                            (item.href !== '/dashboard' && item.href !== '/dashboard/serviceprovider' && item.href !== '/dashboard/supplier' && pathname.startsWith(item.href));
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
                                                {(item.badge || (item.dynamicBadgeKey === 'supplierOrders' && supplierOrdersCount > 0)) && (
                                                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                        {item.dynamicBadgeKey === 'supplierOrders' ? supplierOrdersCount : item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>


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
        </>
    );
}

