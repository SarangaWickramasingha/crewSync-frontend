'use client';

import Navbar from '@/Components/layout/Navbar';
import DashboardSidebar from '@/Components/dashboard/propertyOwner/DashboardSidebar';
import { TasksProvider } from '@/Components/dashboard/TasksContext';

export default function PropertyOwnerLayout({ children }) {
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