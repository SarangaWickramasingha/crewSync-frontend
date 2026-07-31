'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/Components/dashboard/propertyOwner/Card';
import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import MetricCard from '@/Components/dashboard/propertyOwner/MetricCard';
import StatusPill from '@/Components/dashboard/common/StatusPill';
import { useTasks } from '@/Components/dashboard/TasksContext';
import { useAuth } from '@/context/AuthContext';
import { API_PROJECTS } from '@/config/api';


function fmtCompact(n) {
  if (n >= 1000000 || n <= -1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000 || n <= -1000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString();
}

export default function PropertyOwnerOverviewPage() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const { tasks, estimatedBudget, totalCost, remainingBudget, projectCompleted } = useTasks();

  useEffect(() => {
    if (isGuest) {
      router.push('/dashboard/propertyowner/timeline');
    }
  }, [isGuest, router]);

  if (isGuest) {
    return null; // Return null while redirecting
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference * (1 - progressPercent / 100);
  const maxCost = Math.max(1, ...tasks.map((t) => t.cost || 0));

  return (
    <div>
      <DashHeader
        title="My Project: House Build – Kandy"
        subtitle="Started March 2026 · Estimated Completion August 2026"
        action={
            <button 
                onClick={async () => {
                    try {
                        const res = await fetch(API_PROJECTS, {
                            credentials: 'include',
                        });
                        const data = await res.json();
                        // Check if there's an active (unfinished) project
                        const activeProject = data.projects?.find(p => !p.is_finished);
                        if (activeProject) {
                            // Go to that project's timeline instead
                            router.push(`/dashboard/propertyowner/timeline?project_id=${activeProject.project_id}`);
                        } else {
                            router.push('/project-form');
                        }
                    } catch (err) {
                        // If check fails just go to form
                        router.push('/project-form');
                    }
                }}
                className="bg-[#E8820C] hover:bg-[#B85A00] text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors">
                + New Project
            </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        <MetricCard value={`${progressPercent}%`} label="Overall Progress" change={`${completedCount} of ${tasks.length} tasks done`} changeType="up" />
        <MetricCard value={`LKR ${fmtCompact(totalCost)}`} label="Total Cost" change={`of LKR ${fmtCompact(estimatedBudget)} budget`} />
        <MetricCard value={completedCount} label="Tasks Completed" />
        <MetricCard value={tasks.filter((t) => t.assignedSP).length} label="Hired Workers" change="Active now" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-syne text-base font-bold">Project Progress</h3>
            <StatusPill variant={projectCompleted ? 'green' : 'amber'}>
              {projectCompleted ? 'Completed' : 'In Progress'}
            </StatusPill>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
              <circle cx="45" cy="45" r="36" fill="none" stroke="#EEECEA" strokeWidth="10" />
              <circle
                cx="45" cy="45" r="36" fill="none" stroke="#E8820C" strokeWidth="10"
                strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
                transform="rotate(-90 45 45)"
              />
              <text x="45" y="50" textAnchor="middle" fontFamily="Syne, sans-serif" fontSize="16" fontWeight="700" fill="#1A1D23">
                {progressPercent}%
              </text>
            </svg>
            <div className="flex-1 min-w-40">
              {tasks.length === 0 ? (
                <p className="text-sm text-[#8A8FA8]">No tasks yet — add some in the Timeline tab.</p>
              ) : (
                tasks.map((t) => (
                  <div key={t.id} className="flex justify-between py-1.5 text-sm border-b border-black/10 last:border-0">
                    <span>{t.name}</span>
                    <span style={{ color: t.completed ? '#1B6E3A' : '#8A8FA8' }}>
                      {t.completed ? '✓ Done' : 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-syne text-base font-bold mb-4">Budget Overview</h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-[#8A8FA8]">No task costs yet — add costs in the Timeline tab.</p>
          ) : (
            tasks.map((t) => (
              <div key={t.id} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t.name}</span>
                  <span className="font-semibold">LKR {(t.cost || 0).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#EEECEA] rounded">
                  <div className="h-full rounded" style={{ width: `${((t.cost || 0) / maxCost) * 100}%`, background: t.color }} />
                </div>
              </div>
            ))
          )}
          <div className="h-px bg-black/10 my-4" />
          <div className="flex justify-between text-sm font-semibold">
            <span>Remaining Budget</span>
            <span style={{ color: remainingBudget >= 0 ? '#1B6E3A' : '#C0392B' }}>
              LKR {fmtCompact(remainingBudget)}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}