"use client";
import { useTimeline } from "@/src/hooks/provider/useProvider";
import ProjectTimelineCard from "@/src/components/serviceProvider/ProjectTimelineCard";
const C = {
  slate: '#1A1D23', muted: '#8A8FA8',
};

export default function TimelinePage() {
  const { data, isLoading } = useTimeline();
  const projects = data?.projects ?? [];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>Customer Project Timeline</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>View the full project timeline of each job you&apos;re assigned to</p>
      </div>

      {isLoading ? (
        <p style={{ fontSize: '0.85rem', color: C.muted }}>Loading…</p>
      ) : projects.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: C.muted }}>No active projects yet.</p>
      ) : (
        projects.map(proj => (
          <ProjectTimelineCard
            key={proj.project_id}
            projectName={proj.project_name}
            projectStatus={proj.project_status}
            tasks={proj.tasks}
            assignedTaskNames={proj.assigned_task_names}
          />
        ))
      )}
    </div>
  );
}
