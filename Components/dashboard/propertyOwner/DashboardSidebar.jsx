'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTasks } from '@/Components/dashboard/TasksContext';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar({
  userName = 'Nimal Kumarasinghe',
  userRole = 'Property Owner',
  userInitials = 'NK',
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { tasks, notifications } = useTasks();
  const { isGuest, user } = useAuth();

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Compute initials and name from logged in user if available
  const activeName = user ? `${user.fname || ''} ${user.lname || ''}`.trim() || user.name || userName : userName;
  const activeInitials = user && user.fname ? user.fname.slice(0, 2).toUpperCase() : userInitials;

  const navSections = isGuest
    ? [
        {
          label: 'Explore',
          items: [
            { icon: '/icons/propertyowner/timeline.png', text: 'Timeline', href: '/dashboard/propertyowner/timeline' },
            { icon: '/icons/propertyowner/services.png', text: 'Find Services', href: '/dashboard/propertyowner/services' },
            { icon: '/icons/propertyowner/materials.png', text: 'Materials', href: '/dashboard/propertyowner/materials' },
          ],
        },
      ]
    : [
        {
          label: 'Project',
          items: [
            { icon: '/icons/propertyowner/overview.png', text: 'Overview', href: '/dashboard/propertyowner' },
            { icon: '/icons/propertyowner/timeline.png', text: 'Timeline', href: '/dashboard/propertyowner/timeline', badge: pendingCount > 0 ? pendingCount : null },
            { icon: '/icons/propertyowner/forum.png', text: 'Project Forum', href: '/dashboard/propertyowner/forum', badge: 2 },
            { icon: '/icons/propertyowner/reports.png', text: 'Reports', href: '/dashboard/propertyowner/reports' },
          ],
        },
        {
          label: 'Find & Hire',
          items: [
            { icon: '/icons/propertyowner/services.png', text: 'Find Services', href: '/dashboard/propertyowner/services' },
            { icon: '/icons/propertyowner/materials.png', text: 'Materials', href: '/dashboard/propertyowner/materials' },
          ],
        },
        {
          label: 'Account',
          items: [
            { icon: '/icons/propertyowner/reviews.png', text: 'Reviews', href: '/dashboard/propertyowner/reviews' },
            { icon: '/icons/propertyowner/notifications.png', text: 'Notifications', href: '/dashboard/propertyowner/notifications', badge: unreadCount > 0 ? unreadCount : null },
          ],
        },
      ];

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-3.5 left-3.5 z-[300] w-9 h-9 rounded-lg bg-[#E8820C] text-white text-lg flex items-center justify-center shadow-md"
      >
        ☰
      </button>

      {/* Mobile overlay (click to close) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-[#1A1D23]/40 z-[199]"
        />
      )}

      {/* Sidebar itself */}
      <div
        className={`
          bg-white border-r border-black/10 p-4 overflow-y-auto
          fixed top-[60px] left-0 bottom-0 w-60 z-[200] shadow-lg
          md:static md:block md:w-full md:shadow-none md:top-auto md:left-auto md:bottom-auto
          ${open ? 'block' : 'hidden'}
        `}
      >
        {!isGuest && (
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-black/10">
            <div className="w-[38px] h-[38px] rounded-full bg-[#FFF3E0] flex items-center justify-center font-bold text-[#B85A00] text-sm">
              {activeInitials}
            </div>
            <div>
              <div className="text-sm font-semibold">{activeName}</div>
              <div className="text-xs text-[#8A8FA8]">{userRole}</div>
            </div>
          </div>
        )}

        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="text-[0.68rem] font-semibold uppercase tracking-wide text-[#8A8FA8] mb-2 pl-2">
              {section.label}
            </div>
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-[#FFF3E0] text-[#B85A00] font-medium'
                      : 'text-[#4A5068] hover:bg-[#F7F6F2] hover:text-[#1A1D23]'
                  }`}
                >
                  <span>{item.text}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="ml-auto bg-[#E8820C] text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}