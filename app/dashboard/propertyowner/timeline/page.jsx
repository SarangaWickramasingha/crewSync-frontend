import { Suspense } from 'react';
import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import TaskCalendarGrid from '@/Components/dashboard/TaskCalendarGrid';
import ProjectLoader from '@/Components/dashboard/ProjectLoader';

export default function PropertyOwnerTimelinePage() {
  return (
    <div>
      {/*
        ProjectLoader reads ?project_id from the URL and seeds the timeline
        with the real tasks from that project (via TasksContext.loadFromProject).
        Suspense is required by Next.js when using useSearchParams in a child.
      */}
      <Suspense fallback={null}>
        <ProjectLoader />
      </Suspense>

      <DashHeader title="Project Timeline" subtitle="Track your construction tasks week by week" />
      <TaskCalendarGrid />
    </div>
  );
}