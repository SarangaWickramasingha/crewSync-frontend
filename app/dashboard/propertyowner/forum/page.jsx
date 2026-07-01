'use client';

import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import ProjectForum from '@/Components/dashboard/propertyOwner/ProjectForum';
import Card from '@/Components/dashboard/propertyOwner/Card';
import { useTasks } from '@/Components/dashboard/TasksContext';

const CURRENT_USER = {
  name: 'Nimal Kumarasinghe',
  initials: 'NK',
  avatarBg: '#FFF3E0',
  avatarColor: '#B85A00',
};

const DEFAULT_POSTS = [
  {
    id: 1,
    initials: 'NK',
    avatarBg: '#FFF3E0',
    avatarColor: '#B85A00',
    authorName: 'Nimal Kumarasinghe',
    authorTag: '(You)',
    text: 'Just checking in on overall progress. Are we on schedule across all tasks?',
    time: 'Today, 10:30 AM',
    mine: true,
  },
  {
    id: 2,
    initials: 'SK',
    avatarBg: '#E6F4EC',
    avatarColor: '#1B6E3A',
    authorName: 'Sunil Karunaratne',
    authorTag: '· Mason',
    text: "Foundation and roofing are progressing well. We're about 55% through the roofing work.",
    time: 'Today, 10:38 AM',
    mine: false,
  },
];

export default function PropertyOwnerForumPage() {
  const { projectCompleted } = useTasks();

  return (
    <div>
      <DashHeader
        title="Project Forum"
        subtitle="Communicate with your service providers about the project"
      />

      <Card className="p-0">
        <ProjectForum
          title="Project Discussion"
          meta="All service providers on this project · Single shared thread"
          statusLabel={projectCompleted ? 'Completed' : 'Active'}
          statusVariant={projectCompleted ? 'green' : 'amber'}
          currentUser={CURRENT_USER}
          mineBubbleColor="#FFF3E0"
          initialPosts={DEFAULT_POSTS}
        />
      </Card>
    </div>
  );
}