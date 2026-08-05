'use client';

import DashHeader from '@/src/components/propertyOwner/DashHeader';
import ProjectForum from '@/src/components/dashboard/ProjectForum';
import Card from '@/src/components/propertyOwner/Card';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';

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