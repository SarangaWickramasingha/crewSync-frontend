import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import TaskCalendarGrid from '@/Components/dashboard/TaskCalendarGrid';

export default function PropertyOwnerTimelinePage() {
  return (
    <div>
      <DashHeader title="Project Timeline" subtitle="Track your construction tasks week by week" />
      <TaskCalendarGrid />
    </div>
  );
}