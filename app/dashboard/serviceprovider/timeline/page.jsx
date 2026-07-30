"use client";
import { useState, useEffect } from "react";
import { API_PROVIDER_TIMELINE } from "@/config/api";
import ProjectTimelineCard from "@/Components/dashboard/serviceProvider/ProjectTimelineCard";
const C = {
  slate: '#1A1D23', muted: '#8A8FA8',
};

export default function TimelinePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadTimeline() {
      try {
        const res = await fetch(API_PROVIDER_TIMELINE, { method: 'GET', credentials: 'include' });
        const data = await res.json();
        if (isMounted && data.success) setProjects(data.projects);
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTimeline();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>Customer Project Timeline</h2>
        <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>View the full project timeline of each job you're assigned to</p>
      </div>

      {loading ? (
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