'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import MetricCard from '@/src/components/propertyOwner/MetricCard';
import ProjectProgressCard from '@/src/components/propertyOwner/ProjectProgressCard';
import BudgetOverviewCard from '@/src/components/propertyOwner/BudgetOverviewCard';
import { fmtCompact } from '@/src/components/propertyOwner/utils';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Check } from 'lucide-react';

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const cleanStr = String(dateStr).split(' ')[0];
  const parts = cleanStr.split('-');
  if (parts.length >= 2) {
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if (months[monthIndex] && !isNaN(year)) {
      return `${months[monthIndex]} ${year}`;
    }
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return dateStr;
}

function getProjectSubtitle(project, estimatedBudget, projectCompleted) {
  if (!project) return 'Track your construction progress and budget';
  
  const startDate = project.start_date ? formatMonthYear(project.start_date) : '';
  const endDate = (project.target_end_date || project.end_date || project.est_completion_date) 
    ? formatMonthYear(project.target_end_date || project.end_date || project.est_completion_date) 
    : '';

  if (startDate && endDate) {
    return projectCompleted 
      ? `Started ${startDate} · Completed ${endDate}`
      : `Started ${startDate} · Estimated Completion ${endDate}`;
  }
  if (startDate) {
    return `Started ${startDate}`;
  }
  if (endDate) {
    return `Estimated Completion ${endDate}`;
  }
  if (project.district || project.location) {
    return `Location: ${project.district || project.location}`;
  }
  return 'Construction project overview';
}

export default function PropertyOwnerOverviewPage() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const {
    tasks,
    estimatedBudget,
    totalCost,
    remainingBudget,
    projectCompleted,
    projects,
    currentProject,
    currentProjectId,
    projectName,
    loadFromProject,
    isLoaded,
  } = useTasks();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isGuest) {
      router.push('/dashboard/propertyowner/timeline');
    }
  }, [isGuest, router]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isGuest) {
    return null; // Return null while redirecting
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference * (1 - progressPercent / 100);
  const maxCost = Math.max(1, ...tasks.map((t) => t.cost || 0));

  const currentDisplayName = projectName || currentProject?.project_name || (projects.length > 0 ? 'Select Project' : 'No Projects');
  const subtitle = projects.length === 0 && isLoaded
    ? 'No active projects found · Click "+ New Project" to get started'
    : getProjectSubtitle(currentProject, estimatedBudget, projectCompleted);

  const titleElement = (
    <div className="flex items-center gap-2.5 flex-wrap">
      <span className="font-syne text-xl font-bold text-[#1A1D23]">My Project:</span>
      {projects && projects.length > 0 ? (
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 bg-white hover:bg-black/[0.03] border border-black/15 hover:border-black/30 px-3 py-1.5 rounded-lg text-[#1A1D23] font-syne font-bold text-lg md:text-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span className="truncate max-w-[220px] sm:max-w-[340px] md:max-w-[420px]">
              {currentDisplayName}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#8A8FA8] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#16a34a]' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 sm:w-84 bg-white border border-black/10 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
              <div className="px-3.5 py-2 border-b border-black/5 flex items-center justify-between text-[11px] font-semibold text-[#8A8FA8] uppercase tracking-wider bg-black/[0.01]">
                <span>Your Projects</span>
                <span className="bg-[#16a34a]/10 text-[#16a34a] px-2 py-0.5 rounded-full font-bold">
                  {projects.length}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-black/5">
                {projects.map((proj) => {
                  const isSelected = Number(proj.project_id) === Number(currentProjectId);
                  const isFinished = !!Number(proj.is_finished);
                  return (
                    <button
                      key={proj.project_id}
                      type="button"
                      onClick={() => {
                        loadFromProject(proj.project_id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-black/[0.04] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#16a34a]/10 font-semibold' : ''
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className={`text-sm truncate ${isSelected ? 'font-bold text-[#15803d]' : 'font-medium text-[#1A1D23]'}`}>
                          {proj.project_name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              isFinished ? 'bg-[#8A8FA8]' : 'bg-[#16a34a]'
                            }`}
                          />
                          <span className="text-[11px] text-[#8A8FA8]">
                            {isFinished ? 'Completed' : 'In Progress'}
                          </span>
                          {proj.start_date && (
                            <span className="text-[11px] text-[#8A8FA8]">
                              · {formatMonthYear(proj.start_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <span className="font-syne text-xl font-bold text-[#8A8FA8]">
          {isLoaded ? 'No Projects' : 'Loading…'}
        </span>
      )}
    </div>
  );

  return (
    <div>
      <DashHeader
        title={titleElement}
        subtitle={subtitle}
        action={
          <button
            onClick={() => router.push('/project-form')}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors shadow-sm cursor-pointer"
          >
            + New Project
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        <MetricCard
          value={`${progressPercent}%`}
          label="Overall Progress"
          change={`${completedCount} of ${tasks.length} tasks done`}
          changeType={progressPercent > 0 ? 'up' : 'neutral'}
        />
        <MetricCard
          value={`LKR ${fmtCompact(totalCost)}`}
          label="Total Cost"
          change={`of LKR ${fmtCompact(estimatedBudget)} budget`}
        />
        <MetricCard value={completedCount} label="Tasks Completed" />
        <MetricCard
          value={tasks.filter((t) => t.assignedSP).length}
          label="Hired Workers"
          change="Active now"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ProjectProgressCard
          progressPercent={progressPercent}
          circumference={circumference}
          dashOffset={dashOffset}
          projectCompleted={projectCompleted}
          tasks={tasks}
        />

        <BudgetOverviewCard tasks={tasks} maxCost={maxCost} remainingBudget={remainingBudget} />
      </div>
    </div>
  );
}