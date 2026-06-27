import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import ProjectForum from '@/Components/dashboard/propertyOwner/ProjectForum';

const CURRENT_USER = {
  name: 'Nimal Kumarasinghe',
  initials: 'NK',
  avatarBg: '#FFF3E0',
  avatarColor: '#B85A00',
};

export default function PropertyOwnerForumPage() {
  return (
    <div>
      <DashHeader
        title="Project Forum"
        subtitle="Communicate with your service providers on each project"
      />

      <ProjectForum
        title="🏗️ Phase 3 – Roofing"
        meta="3 participants · Last activity: Today 10:42 AM"
        statusLabel="Active"
        statusVariant="amber"
        currentUser={CURRENT_USER}
        mineBubbleColor="#FFF3E0"
        initialPosts={[
          { id: 1, initials: 'NK', avatarBg: '#FFF3E0', avatarColor: '#B85A00', authorName: 'Nimal Kumarasinghe', authorTag: '(You)', text: 'Just checking in on the roofing progress. Are we on schedule?', time: 'Today, 10:30 AM', mine: true },
          { id: 2, initials: 'SK', avatarBg: '#E6F4EC', avatarColor: '#1B6E3A', authorName: 'Sunil Karunaratne', authorTag: '· Mason', text: "Yes, we've completed about 55% of the roofing. The remaining work should be done by May 22.", time: 'Today, 10:38 AM', mine: false },
          { id: 3, initials: 'SK', avatarBg: '#E6F4EC', avatarColor: '#1B6E3A', authorName: 'Sunil Karunaratne', authorTag: '· Mason', text: 'We need one more bundle of roofing tiles — can you arrange?', time: 'Today, 10:42 AM', mine: false },
        ]}
      />

      <ProjectForum
        title="🏛️ Phase 1 – Foundation"
        meta="2 participants · Last activity: April 2, 2026"
        statusLabel="Completed"
        statusVariant="green"
        currentUser={CURRENT_USER}
        mineBubbleColor="#FFF3E0"
        initialPosts={[
          { id: 1, initials: 'NK', avatarBg: '#FFF3E0', avatarColor: '#B85A00', authorName: 'Nimal Kumarasinghe', authorTag: '(You)', text: 'Great work on the foundation! Everything looks solid. Ready to proceed to Phase 2.', time: 'April 2, 2026', mine: true },
          { id: 2, initials: 'SK', avatarBg: '#E6F4EC', avatarColor: '#1B6E3A', authorName: 'Sunil Karunaratne', authorTag: '· Mason', text: 'Thank you! The foundation depth is 1.2m with proper reinforcement. All curing is complete.', time: 'April 2, 2026', mine: false },
        ]}
      />
    </div>
  );
}