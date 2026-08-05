"use client";
import { useTimeline } from "@/src/hooks/provider/useProvider";
import ProjectForum from "@/src/components/dashboard/ProjectForum";

export default function ServiceProviderForumPage() {
  const { data, isLoading } = useTimeline();
  const projects = data?.projects ?? [];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#1A1D23' }}>Project Forums</h2>
        <p style={{ fontSize: '0.82rem', color: '#8A8FA8', marginTop: '2px' }}>Discuss progress and updates with property owners on each project you&apos;re assigned to</p>
      </div>

      {isLoading ? (
        <p style={{ fontSize: '0.85rem', color: '#8A8FA8' }}>Loading…</p>
      ) : projects.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: '#8A8FA8' }}>No active projects yet — forums will appear here once you&apos;re assigned to a task.</p>
      ) : (
        projects.map(proj => (
          <ProjectForum
            key={proj.project_id}
            projectId={proj.project_id}
            title={proj.project_name}
            meta={proj.assigned_task_names && proj.assigned_task_names.length > 0
              ? `Your task${proj.assigned_task_names.length > 1 ? 's' : ''}: ${proj.assigned_task_names.join(', ')}`
              : 'No specific task assigned'}
            statusLabel={proj.project_status}
            statusVariant={proj.project_status === 'Completed' ? 'green' : 'amber'}
            mineBubbleColor="#FFF3E0"
          />
        ))
      )}
    </div>
  );
}
