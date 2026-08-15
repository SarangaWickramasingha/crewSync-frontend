'use client';

import { useState, useEffect } from 'react';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import AvailableReportsCard from '@/src/components/propertyOwner/AvailableReportsCard';
import { reportApi, projectApi } from '@/src/api';

function buildReportsList(proj) {
  const existingByTask = {};
  let existingProject = null;
  (proj.stored || []).forEach((r) => {
    if (r.report_type === 'task' && r.task_id != null) existingByTask[r.task_id] = r;
    if (r.report_type === 'project') existingProject = r;
  });

  return [
    ...(proj.tasks || []).map((t) => {
      const completed = !!Number(t.is_finished);
      const existing = existingByTask[t.task_id];
      return {
        id: `task-${t.task_id}`,
        iconType: 'doc',
        name: `Task Report – ${t.task_name}`,
        meta: completed
          ? (existing ? `Already generated · ${existing.generated_date}` : 'Ready to generate')
          : 'Available once the task is completed',
        status: completed ? 'ready' : 'pending',
        type: 'task',
        task: { id: t.task_id },
      };
    }),
    {
      id: 'project-report',
      iconType: 'chart',
      name: 'Full Project Completion Report',
      meta: proj.completed
        ? (existingProject ? 'Already generated · PDF on file' : 'Ready to generate')
        : 'Available once the project is completed',
      status: proj.completed ? 'ready' : 'pending',
      type: 'project',
    },
    {
      id: 'cost-summary-report',
      iconType: 'trend',
      name: 'Project Cost Summary Report',
      meta: proj.completed
        ? (existingProject
          ? `PDF on file · Budget LKR ${proj.budget.toLocaleString()}`
          : `Ready to generate · Budget LKR ${proj.budget.toLocaleString()}`)
        : `Available once the project is completed · Budget LKR ${proj.budget.toLocaleString()}`,
      status: proj.completed ? 'ready' : 'pending',
      type: 'project',
    },
  ];
}

export default function PropertyOwnerReportsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    let cancelled = false;
    projectApi
      .fetchProjects()
      .then(async (data) => {
        const projList = data.projects || [];
        const loaded = await Promise.all(
          projList.map(async (p) => {
            try {
              const [full, stored] = await Promise.all([
                projectApi.fetchProject(p.project_id),
                reportApi.fetchProjectReports(p.project_id),
              ]);
              return {
                id: p.project_id,
                name: full.project?.project_name || 'Project',
                completed: !!Number(full.project?.is_finished),
                budget: Number(full.project?.p_budget) || 0,
                tasks: full.tasks || [],
                stored: stored.reports || [],
              };
            } catch (e) {
              console.error(`Failed to load data for project ${p.project_id}:`, e);
              return null;
            }
          })
        );
        if (!cancelled) setProjects(loaded.filter(Boolean));
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || 'Failed to load reports.');
      })
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDownload(proj, report) {
    setDownloading({ projectId: proj.id, reportId: report.id });
    setError(null);
    try {
      const res =
        report.type === 'task'
          ? await reportApi.generateTaskReport(report.task.id)
          : await reportApi.generateProjectReport(proj.id);
      if (res.file_path) window.open(res.file_path, '_blank');
      const data = await reportApi.fetchProjectReports(proj.id);
      const newStored = data.reports || [];
      setProjects((ps) => ps.map((p) => (p.id === proj.id ? { ...p, stored: newStored } : p)));
    } catch (e) {
      setError(e?.message || 'Failed to generate the report.');
    } finally {
      setDownloading(null);
    }
  }

  async function handleProjectReport(proj) {
    setDownloading({ projectId: proj.id, reportId: 'project-report' });
    setError(null);
    try {
      const res = await reportApi.generateProjectReport(proj.id);
      if (res.file_path) window.open(res.file_path, '_blank');
      const data = await reportApi.fetchProjectReports(proj.id);
      const newStored = data.reports || [];
      setProjects((ps) => ps.map((p) => (p.id === proj.id ? { ...p, stored: newStored } : p)));
    } catch (e) {
      setError(e?.message || 'Failed to generate the project report.');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div>
      <DashHeader title="Reports & Documentation" subtitle="Download project records at any stage" />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[#FDE8E8] text-sm text-[#C0392B]">
          {error}
        </div>
      )}

      {!isLoaded ? (
        <div className="text-sm text-[#8A8FA8]">Loading reports…</div>
      ) : projects.length === 0 ? (
        <div className="text-sm text-[#8A8FA8]">No projects found.</div>
      ) : (
        <div className="grid md:grid-cols-1 gap-4">
          {projects.map((proj) => (
            <AvailableReportsCard
              key={proj.id}
              projectName={proj.name}
              projectCompleted={proj.completed}
              reports={buildReportsList(proj)}
              downloadingId={downloading?.projectId === proj.id ? downloading.reportId : null}
              onDownloadReport={(r) => handleDownload(proj, r)}
              onDownloadProject={() => handleProjectReport(proj)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
