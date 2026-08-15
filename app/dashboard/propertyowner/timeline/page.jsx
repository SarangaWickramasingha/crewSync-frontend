'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import TaskCalendarGrid from '@/src/components/propertyOwner/TaskCalendarGrid';
import { projectApi } from '@/src/api';

export default function PropertyOwnerTimelinePage() {
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

  if (activeProjects === null) {
    return (
      <div>
        <DashHeader title="Project Timeline" subtitle="Track your construction tasks week by week" />
        <div className="flex items-center justify-center rounded-xl border border-[rgba(26,29,35,0.1)] bg-white py-16 text-sm text-[#8A8FA8]">
          Loading your projects…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <DashHeader title="Project Timeline" subtitle="Track your construction tasks week by week" />
        <div className="rounded-xl border border-[#FDECEA] bg-[#FDECEA] px-4 py-3 text-sm text-[#C0392B]">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashHeader title="Project Timeline" subtitle="Track your construction tasks week by week" />

      {activeProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[rgba(26,29,35,0.1)] bg-white py-16 text-center">
          <div className="text-sm font-semibold text-[#1A1D23]">No active projects</div>
          <p className="mt-1 text-[13px] text-[#8A8FA8]">
            You don&apos;t have any unfinished projects right now.
          </p>
          <Link
            href="/project-form"
            className="mt-4 rounded-lg bg-[#E8820C] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#B85A00]"
          >
            + Start a New Project
          </Link>
        </div>
      ) : (
        activeProjects.map((p) => (
          <div key={p.project_id} className="mb-10">
            <div className="mb-3 flex items-center gap-2.5">
              <h2 className="font-syne text-lg font-bold text-[#1A1D23]">{p.project_name}</h2>
              <span className="rounded-full bg-[#FFF3E0] px-2.5 py-0.5 text-[11px] font-semibold text-[#B85A00]">
                In Progress
              </span>
            </div>
            <TaskCalendarGrid projectId={p.project_id} />
          </div>
        ))
      )}
    </div>
  );
}
