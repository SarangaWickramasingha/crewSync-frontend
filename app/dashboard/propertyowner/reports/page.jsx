'use client';

import { useState } from 'react';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import Card from '@/src/components/propertyOwner/Card';
import StatusPill from '@/src/components/ui/StatusPill';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';

export default function PropertyOwnerReportsPage() {
  const { tasks, projectCompleted, estimatedBudget, totalCost, remainingBudget } = useTasks();
  const [customReportType, setCustomReportType] = useState('Cost Summary');
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-05-12');

  // Build the list of reports dynamically based on task and project completion
  const reportsList = [
    // 1. Task reports
    ...tasks.map((t) => ({
      id: `task-${t.id}`,
      iconType: 'doc',
      name: `Task Report – ${t.name}`,
      meta: t.completed ? 'Completed' : 'In progress…',
      status: t.completed ? 'ready' : 'pending',
      type: 'task',
      task: t,
    })),
    // 2. Project report
    {
      id: 'project-report',
      iconType: 'chart',
      name: 'Full Project Completion Report',
      meta: projectCompleted ? 'Completed' : 'Project in progress…',
      status: projectCompleted ? 'ready' : 'pending',
      type: 'project',
    },
    // 3. Cost Summary Report (always ready)
    {
      id: 'cost-summary-report',
      iconType: 'trend',
      name: 'Project Cost Summary Report',
      meta: `Auto-generated · Budget LKR ${estimatedBudget.toLocaleString()}`,
      status: 'ready',
      type: 'cost',
    }
  ];

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
    // default: doc
    return (
      <svg className="w-4 h-4 inline-block mr-1.5 text-[#4A5068]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }

  function downloadReport(report) {
    let content = '';
    let filename = '';

    if (report.type === 'task') {
      const t = report.task;
      filename = `${t.name.toLowerCase().replace(/\s+/g, '_')}_report.txt`;
      content = `CREWSYNC TASK REPORT: ${t.name.toUpperCase()}
==================================================
Task ID:      ${t.id}
Task Name:    ${t.name}
Status:       COMPLETED
Assigned SP:  ${t.assignedSP || 'Not assigned'}
Task Cost:    LKR ${(t.cost || 0).toLocaleString()}
Days Scheduled: ${Object.keys(t.days || {}).length} day(s)
==================================================
Report generated on: ${new Date().toLocaleString()}
`;
    } else if (report.type === 'project') {
      filename = `full_project_completion_report.txt`;
      content = `CREWSYNC FULL PROJECT COMPLETION REPORT
==================================================
Project Status: COMPLETED
Estimated Budget: LKR ${estimatedBudget.toLocaleString()}
Total Project Cost: LKR ${totalCost.toLocaleString()}
Remaining Budget: LKR ${remainingBudget.toLocaleString()}
Budget Utilization: ${estimatedBudget > 0 ? ((totalCost / estimatedBudget) * 100).toFixed(1) : 0}%

Summary of Tasks:
--------------------------------------------------
${tasks.map(t => `- ${t.name}:
  * Status:      ${t.completed ? 'Completed' : 'Pending'}
  * Assigned SP: ${t.assignedSP || 'None'}
  * Total Cost:  LKR ${(t.cost || 0).toLocaleString()}`).join('\n\n')}
==================================================
Report generated on: ${new Date().toLocaleString()}
`;
    } else if (report.type === 'cost') {
      filename = `project_cost_summary_report.txt`;
      content = `CREWSYNC PROJECT COST SUMMARY REPORT
==================================================
Estimated Budget: LKR ${estimatedBudget.toLocaleString()}
Total Cost to Date: LKR ${totalCost.toLocaleString()}
Remaining Budget: LKR ${remainingBudget.toLocaleString()}
Budget Utilization: ${estimatedBudget > 0 ? ((totalCost / estimatedBudget) * 100).toFixed(1) : 0}%

Detailed Task Costs:
--------------------------------------------------
${tasks.map(t => `- ${t.name}: LKR ${(t.cost || 0).toLocaleString()} (${t.assignedSP ? `SP: ${t.assignedSP}` : 'No SP Assigned'})`).join('\n')}
==================================================
Report generated on: ${new Date().toLocaleString()}
`;
    }

    // Trigger browser download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleGenerateCustomReport() {
    let content = '';
    let filename = '';

    // Filter tasks that have days active within the custom date range
    const filteredTasks = tasks.filter((t) => {
      const activeDays = Object.keys(t.days || {});
      if (activeDays.length === 0) return false;
      return activeDays.some((d) => d >= fromDate && d <= toDate);
    });

    const periodCost = filteredTasks.reduce((sum, t) => sum + (Number(t.cost) || 0), 0);

    if (customReportType === 'Cost Summary') {
      filename = `custom_cost_summary_report_${fromDate}_to_${toDate}.txt`;
      content = `CREWSYNC CUSTOM COST SUMMARY REPORT
==================================================
Period:           ${fromDate} to ${toDate}
Estimated Budget: LKR ${estimatedBudget.toLocaleString()}
Total Cost:       LKR ${totalCost.toLocaleString()}
Remaining Budget: LKR ${remainingBudget.toLocaleString()}
--------------------------------------------------
Total Period Cost: LKR ${periodCost.toLocaleString()} (for ${filteredTasks.length} active tasks)

Tasks Cost Breakdown:
--------------------------------------------------
${filteredTasks.length === 0 
  ? 'No tasks active in this period.' 
  : filteredTasks.map(t => `- ${t.name}: LKR ${(t.cost || 0).toLocaleString()}`).join('\n')}
==================================================
Report generated on: ${new Date().toLocaleString()}
`;
    } else if (customReportType === 'Task Completion') {
      filename = `custom_task_completion_report.txt`;
      const completedTasks = filteredTasks.filter(t => t.completed);
      const pendingTasks = filteredTasks.filter(t => !t.completed);
      content = `CREWSYNC CUSTOM TASK COMPLETION REPORT
==================================================
Period: ${fromDate} to ${toDate}

Completed Tasks (${completedTasks.length}):
--------------------------------------------------
${completedTasks.length === 0 
  ? 'No completed tasks active in this period.' 
  : completedTasks.map(t => `- ${t.name}
  * Cost: LKR ${(t.cost || 0).toLocaleString()}
  * SP:   ${t.assignedSP || 'None'}`).join('\n\n')}

Pending Tasks (${pendingTasks.length}):
--------------------------------------------------
${pendingTasks.length === 0 
  ? 'No pending tasks active in this period.' 
  : pendingTasks.map(t => `- ${t.name}
  * Cost: LKR ${(t.cost || 0).toLocaleString()}
  * SP:   ${t.assignedSP || 'None'}`).join('\n\n')}
==================================================
Report generated on: ${new Date().toLocaleString()}
`;
    } else if (customReportType === 'Labour Log') {
      filename = `custom_labour_log_report_${fromDate}_to_${toDate}.txt`;
      const assigned = filteredTasks.filter(t => t.assignedSP);
      const unassigned = filteredTasks.filter(t => !t.assignedSP);
      content = `CREWSYNC LABOUR LOG REPORT
==================================================
Period: ${fromDate} to ${toDate}

Assigned Workers:
--------------------------------------------------
${assigned.length === 0 
  ? 'No assigned workers active in this period.' 
  : assigned.map(t => `- Task: ${t.name}\n  Worker: ${t.assignedSP}`).join('\n\n')}

Unassigned Tasks:
--------------------------------------------------
${unassigned.length === 0 
  ? 'No unassigned tasks active in this period.' 
  : unassigned.map(t => `- ${t.name}`).join('\n')}
==================================================
Report generated on: ${new Date().toLocaleString()}
`;
    } else if (customReportType === 'Full Project Report') {
      filename = `custom_full_project_report_${fromDate}_to_${toDate}.txt`;
      content = `CREWSYNC FULL PROJECT REPORT
==================================================
Period:           ${fromDate} to ${toDate}
Project Status:   ${projectCompleted ? 'COMPLETED' : 'IN PROGRESS'}
Estimated Budget: LKR ${estimatedBudget.toLocaleString()}
Total Cost:       LKR ${totalCost.toLocaleString()}
Remaining Budget: LKR ${remainingBudget.toLocaleString()}
--------------------------------------------------
Total Period Cost: LKR ${periodCost.toLocaleString()} (for ${filteredTasks.length} active tasks)

Tasks Status & Cost Details:
--------------------------------------------------
${filteredTasks.length === 0 
  ? 'No tasks active in this period.' 
  : filteredTasks.map(t => `- ${t.name}:
  * Status:      ${t.completed ? 'Completed' : 'In Progress'}
  * Cost:        LKR ${(t.cost || 0).toLocaleString()}
  * Assigned SP: ${t.assignedSP || 'None'}`).join('\n\n')}
==================================================
Report generated on: ${new Date().toLocaleString()}
`;
    }

    // Trigger browser download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <DashHeader title="Reports & Documentation" subtitle="Download project records at any stage" />

      <div className="grid md:grid-cols-2 gap-4">
        {/* Available Reports */}
        <Card>
          <h3 className="font-syne text-base font-bold mb-4">Available Reports</h3>
          <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
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
                    onClick={() => downloadReport(r)}
                    className="border border-black/10 rounded-md px-2.5 py-1 text-xs bg-white text-[#1A1D23] hover:bg-[#F7F6F2] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Generate Custom Report */}
        <Card>
          <h3 className="font-syne text-base font-bold mb-4">Generate Custom Report</h3>

          <div className="flex flex-col gap-1.5 mb-3.5">
            <label className="text-xs font-semibold text-[#4A5068]">Report Type</label>
            <select 
              value={customReportType}
              onChange={(e) => setCustomReportType(e.target.value)}
              className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
            >
              <option value="Cost Summary">Cost Summary</option>
              <option value="Task Completion">Task Completion</option>
              <option value="Labour Log">Labour Log</option>
              <option value="Full Project Report">Full Project Report</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 mb-3.5">
            <label className="text-xs font-semibold text-[#4A5068]">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-semibold text-[#4A5068]">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
            />
          </div>

          <button 
            onClick={handleGenerateCustomReport}
            className="bg-[#E8820C] hover:bg-[#B85A00] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Generate Report
          </button>
        </Card>
      </div>
    </div>
  );
}