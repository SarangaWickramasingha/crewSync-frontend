'use client';

import { useEffect, useState } from 'react';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import ProjectForum from '@/src/components/dashboard/ProjectForum';
import { projectApi } from '@/src/api';

export default function PropertyOwnerForumPage() {
  const [activeProjects, setActiveProjects] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    projectApi
      .fetchProjects()
      .then((data) => {
        if (cancelled) return;
        setActiveProjects((data.projects || []).filter((p) => !Number(p.is_finished)));
      })
      .catch((e) => {
        if (!cancelled) {
          console.error('Failed to load projects:', e);
          setError(e?.message || 'Failed to load your projects.');
          setActiveProjects([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <DashHeader
        title="Project Forum"
        subtitle="Communicate with your service providers about the project"
      />

      {activeProjects === null && (
        <div className="rounded-xl border border-[rgba(26,29,35,0.1)] bg-white px-4 py-16 text-center text-sm text-[#8A8FA8]">
          Loading your projects…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-[#FDECEA] bg-[#FDECEA] px-4 py-3 text-sm text-[#C0392B]">
          {error}
        </div>
      )}

      {activeProjects && !error && activeProjects.length === 0 && (
        <div className="rounded-xl border border-[rgba(26,29,35,0.1)] bg-white px-4 py-16 text-center">
          <div className="text-sm font-semibold text-[#1A1D23]">No active projects</div>
          <p className="mt-1 text-[13px] text-[#8A8FA8]">
            You don&apos;t have any unfinished projects right now.
          </p>
        </div>
      )}

      {activeProjects &&
        activeProjects.map((p) => (
          <ProjectForum
            key={p.project_id}
            projectId={p.project_id}
            title={p.project_name}
            meta="All service providers on this project · Single shared thread"
            statusLabel="Active"
            statusVariant="amber"
            mineBubbleColor="#FFF3E0"
          />
        ))}
    </div>
  );
}
