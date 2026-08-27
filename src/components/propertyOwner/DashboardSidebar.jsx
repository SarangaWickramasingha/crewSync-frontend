'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';
import { useAuth } from '@/context/AuthContext';

import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Search,
  Package,
  Star,
  Bell
} from 'lucide-react';

export default function DashboardSidebar({
  userName = 'Nimal Kumarasinghe',
  userRole = 'Property Owner',
  userInitials = 'NK',
  open,
  setOpen,
}) {
  const pathname = usePathname();
  const { tasks, notifications } = useTasks();
  const { isGuest, user } = useAuth();

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const activeName = user?.name || userName;
  const activeInitials = user?.avatar || userInitials;

    const navSections = isGuest
    ? [
        {
          label: 'Explore',
          items: [
            { icon: CalendarDays, text: 'Timeline', href: '/dashboard/propertyowner/timeline' },
            { icon: Search, text: 'Find Services', href: '/dashboard/propertyowner/services' },
            { icon: Package, text: 'Materials', href: '/dashboard/propertyowner/materials' },
          ],
        },
      ]
    : [
        {
          label: 'Project',
          items: [
            { icon: LayoutDashboard, text: 'Overview', href: '/dashboard/propertyowner' },
            { icon: CalendarDays, text: 'Timeline', href: '/dashboard/propertyowner/timeline', badge: pendingCount > 0 ? pendingCount : null },
            { icon: MessageSquare, text: 'Project Forum', href: '/dashboard/propertyowner/forum', badge: 2 },
            { icon: BarChart3, text: 'Reports', href: '/dashboard/propertyowner/reports' },
          ],
        },
        {
          label: 'Find & Hire',
          items: [
            { icon: Search, text: 'Find Services', href: '/dashboard/propertyowner/services' },
            { icon: Package, text: 'Materials', href: '/dashboard/propertyowner/materials' },
          ],
        },
        {
          label: 'Account',
          items: [
            { icon: Star, text: 'Reviews', href: '/dashboard/propertyowner/reviews' },
            { icon: Bell, text: 'Notifications', href: '/dashboard/propertyowner/notifications', badge: unreadCount > 0 ? unreadCount : null },
          ],
        },
      ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 z-[199]"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-white border-r border-black/10 p-4 overflow-y-auto
          fixed top-[60px] left-0 bottom-0 w-60 z-[200] shadow-lg
          md:sticky md:top-[60px] md:h-[calc(100vh-60px)] md:block md:w-full md:shadow-none md:z-auto
          ${open ? 'block' : 'hidden'}
        `}
      >
        {!isGuest && (
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-black/10">
            <div className="w-9 h-9 rounded-full bg-[var(--color-owner-light)] flex items-center justify-center font-bold text-[var(--color-owner-dark)] text-sm">
              {activeInitials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{activeName}</div>
              <div className="text-[0.65rem] text-[#8A8FA8]">{userRole}</div>
            </div>
          </div>
        )}

        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#8A8FA8] mb-2 px-2">
              {section.label}
            </div>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon; // Get the Lucide icon component
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? 'bg-[var(--color-owner-light)] text-[var(--color-owner)] font-medium'
                          : 'text-[#4A5068] hover:bg-[#F7F6F2] hover:text-[#1A1D23]'
                      }`}
                    >
                      {/* Render the icon inside a rounded wrapper with the owner's light-green background */}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--color-owner-light)]">
                        <Icon size={16} className="text-[var(--color-owner-dark)]" strokeWidth={2.2} />
                      </div>
                    
                      <span className="flex-1">{item.text}</span>
                    
                      {item.badge != null && (
                        <span className="ml-auto bg-[var(--color-owner)] text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">
                         {item.badge}
                        </span>
                     )}
                   </Link>
                  );
                })}
              </div>
            </div>
        ))}
      </div>
    </>
  );
}
