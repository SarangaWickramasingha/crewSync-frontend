'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/Components/layout/Navbar';
import DashboardSidebar from '@/Components/dashboard/propertyOwner/DashboardSidebar';
import { TasksProvider } from '@/Components/dashboard/TasksContext';

export default function PropertyOwnerLayout({ children }) {
  const { isGuest, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pages that guest property owners are legally allowed to click into
  const allowedGuestPages = [
    '/dashboard/propertyowner/timeline',
    '/dashboard/propertyowner/services',
    '/dashboard/propertyowner/materials'
  ];

  useEffect(() => {
    // If auth state is still loading, do nothing yet
    if (loading) return;

    // If they are a guest but trying to access an internal page (overview, forum, reports, etc.)
    if (isGuest && !allowedGuestPages.includes(pathname)) {
      router.replace('/dashboard/propertyowner/timeline');
    }
  }, [isGuest, loading, pathname, router]);

  // Prevent UI flashing or hydration mismatches while fetching auth state
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F7F6F2] font-['DM_Sans'] text-sm text-[#8A8FA8]">
        Loading workspace...
      </div>
    );
  }

  return (
    <>
      <Navbar variant="propertyOwnerDashboard" />
      <TasksProvider>
        <div className="grid md:grid-cols-[220px_1fr] min-h-[calc(100vh-60px)]">
          <DashboardSidebar />
          <main className="p-6 md:p-8 bg-[#F7F6F2]">{children}</main>
        </div>
      </TasksProvider>
    </>
  );
}