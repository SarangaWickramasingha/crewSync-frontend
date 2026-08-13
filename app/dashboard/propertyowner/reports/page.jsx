'use client';

import { useState, useEffect } from 'react';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import Card from '@/src/components/propertyOwner/Card';
import StatusPill from '@/src/components/ui/StatusPill';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';
import { reportApi, projectApi } from '@/src/api';

function ReportIcon({ type }) {
  if (type === 'chart') return (
    <svg className="w-4 h-4 inline-block mr-1.5 text-[#4A5068]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
  if (type === 'trend') return (
    <svg className="w-4 h-4 inline-block mr-1.5 text-[#4A5068]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
  return (
    <svg className="w-4 h-4 inline-block mr-1.5 text-[#4A5068]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

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
        <Card>
          <h3 className="font-syne text-base font-bold mb-4">Available Reports</h3>
          <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
            {projectName && (
              <div className="flex justify-between items-center px-3.5 py-2.5 rounded-lg bg-[#F7F6F2]">
                <div>
                  <div className="text-sm font-semibold flex items-center text-[#1A1D23]">
                    <span className="inline-block mr-1.5 text-[#E8820C]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l-3.5 3.5M9 8.75L11.25 6.5a1.414 1.414 0 012 2L11 11l4 4 2.5-2.5a1.414 1.414 0 012 2L15.5 18.5A5.5 5.5 0 019.5 12.5L6 16a1.414 1.414 0 11-2-2l3.5-3.5a1.414 1.414 0 112 2z" />
                      </svg>
                    </span>
                    {projectName}
                  </div>
                  <div className="text-xs text-[#8A8FA8] mt-0.5">Project</div>
                </div>
              </div>
            )}
            {reportsList.map((r) => (
              <div
                key={r.id}
                className={`flex justify-between items-center px-3.5 py-2.5 rounded-lg ${
                  r.status === 'pending' ? 'bg-[#EEECEA] opacity-60' : 'bg-[#F7F6F2]'
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold flex items-center ${r.status === 'pending' ? 'text-[#8A8FA8]' : 'text-[#1A1D23]'}`}>
                    <ReportIcon type={r.iconType} /> {r.name}
                  </div>
                  <div className="text-xs text-[#8A8FA8] mt-0.5">{r.meta}</div>
                </div>
                {r.status === 'pending' ? (
                  <StatusPill variant="amber">Pending</StatusPill>
                ) : (
                  <button
                    onClick={() => handleDownload(r)}
                    disabled={downloadingId === r.id}
                    className="border border-black/10 rounded-md px-2.5 py-1 text-xs bg-white text-[#1A1D23] hover:bg-[#F7F6F2] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {downloadingId === r.id ? 'Generating…' : 'Download'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}