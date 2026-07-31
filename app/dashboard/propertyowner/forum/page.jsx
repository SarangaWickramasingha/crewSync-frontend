'use client';

import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import ProjectForum from '@/Components/dashboard/common/ProjectForum';
import Card from '@/Components/dashboard/propertyOwner/Card';
import { useTasks } from '@/Components/dashboard/TasksContext';

export default function PropertyOwnerForumPage() {
  const { projectCompleted, currentProjectId } = useTasks();

  return (
    <div>
      <DashHeader
        title="Project Forum"
        subtitle="Communicate with your service providers about the project"
      />

      <Card className="p-0">
        <ProjectForum
          projectId={currentProjectId}
          title="Project Discussion"
          meta="All service providers on this project · Single shared thread"
          statusLabel={projectCompleted ? 'Completed' : 'Active'}
          statusVariant={projectCompleted ? 'green' : 'amber'}
          mineBubbleColor="#FFF3E0"
        />
      </Card>
    </div>
  );
}