'use client';

import { useState, useEffect } from 'react';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import AvailableReportsCard from '@/src/components/propertyOwner/AvailableReportsCard';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';
import { reportApi, projectApi } from '@/src/api';

export default function PropertyOwnerReportsPage() {
  const { tasks, projectCompleted, estimatedBudget, currentProjectId, isLoaded } = useTasks();
  const [storedReports, setStoredReports] = useState([]);
  const [projectName, setProjectName] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !currentProjectId) return;
    reportApi
      .fetchProjectReports(currentProjectId)
      .then((data) => setStoredReports(data.reports || []))
      .catch((e) => console.error('Failed to load stored reports:', e));
    projectApi
      .fetchProject(currentProjectId)
      .then((data) => setProjectName(data.project?.project_name || null))
      .catch(() => setProjectName(null));
  }, [isLoaded, currentProjectId]);

  const existingByTask = {};
  let existingProject = null;
  storedReports.forEach((r) => {
    if (r.report_type === 'task' && r.task_id != null) existingByTask[r.task_id] = r;
    if (r.report_type === 'project') existingProject = r;
  });

  async function handleDownload(report) {
    setDownloadingId(report.id);
    setError(null);
    try {
      const res =
        report.type === 'task'
          ? await reportApi.generateTaskReport(report.task.id)
          : await reportApi.generateProjectReport(currentProjectId);
      if (res.file_path) window.open(res.file_path, '_blank');
      const data = await reportApi.fetchProjectReports(currentProjectId);
      setStoredReports(data.reports || []);
    } catch (e) {
      setError(e?.message || 'Failed to generate the report.');
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleProjectReport() {
    setDownloadingId('project-report');
    setError(null);
    try {
      const res = await reportApi.generateProjectReport(currentProjectId);
      if (res.file_path) window.open(res.file_path, '_blank');
      const data = await reportApi.fetchProjectReports(currentProjectId);
      setStoredReports(data.reports || []);
    } catch (e) {
      setError(e?.message || 'Failed to generate the project report.');
    } finally {
      setDownloadingId(null);
    }
  }

  const reportsList = [
    ...tasks.map((t) => ({
      id: `task-${t.id}`,
      iconType: 'doc',
      name: `Task Report – ${t.name}`,
      meta: t.completed
        ? (existingByTask[t.id] ? `Already generated · ${existingByTask[t.id].generated_date}` : 'Ready to generate')
        : 'Available once the task is completed',
      status: t.completed ? 'ready' : 'pending',
      type: 'task',
      task: t,
    })),
    {
      id: 'project-report',
      iconType: 'chart',
      name: 'Full Project Completion Report',
      meta: projectCompleted
        ? (existingProject ? 'Already generated · PDF on file' : 'Ready to generate')
        : 'Available once the project is completed',
      status: projectCompleted ? 'ready' : 'pending',
      type: 'project',
    },
    {
      id: 'cost-summary-report',
      iconType: 'trend',
      name: 'Project Cost Summary Report',
      meta: projectCompleted
        ? (existingProject ? `PDF on file · Budget LKR ${estimatedBudget.toLocaleString()}` : `Ready to generate · Budget LKR ${estimatedBudget.toLocaleString()}`)
        : `Available once the project is completed · Budget LKR ${estimatedBudget.toLocaleString()}`,
      status: projectCompleted ? 'ready' : 'pending',
      type: 'project',
    },
  ];

  return (
    <div>
      <DashHeader title="Reports & Documentation" subtitle="Download project records at any stage" />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[#FDE8E8] text-sm text-[#C0392B]">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-1 gap-4">
        <AvailableReportsCard
          projectName={projectName}
          projectCompleted={projectCompleted}
          reports={reportsList}
          downloadingId={downloadingId}
          onDownloadReport={handleDownload}
          onDownloadProject={handleProjectReport}
        />
      </div>
    </div>
  );
}