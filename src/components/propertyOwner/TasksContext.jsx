'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { projectApi, taskApi, notificationApi } from '@/src/api';
const TasksContext = createContext(null);

const INIT_TASKS = [];
const INIT_NOTIFICATIONS = [];
const DEFAULT_BUDGET = 0;
const TASK_COLORS = ['#16a34a', '#15803d'];

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [nextId, setNextId] = useState(20);
  const [projectCompleted, setProjectCompleted] = useState(false);
  const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState(DEFAULT_BUDGET);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);

  async function refreshProjects() {
    try {
      const data = await projectApi.fetchProjects();
      const projList = data.projects || [];
      setProjects(projList);
      return projList;
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      return [];
    }
  }

  useEffect(() => {
    // One-time cleanup of old test data cached in the browser
    if (typeof window !== 'undefined') {
      ['crewsync_tasks', 'crewsync_next_id', 'crewsync_project_completed',
        'crewsync_notifications', 'crewsync_budget', 'crewsync_project_id']
        .forEach((k) => localStorage.removeItem(k));
    }

    async function init() {
      try {
        // Load notifications from the database
        try {
          const notifsData = await notificationApi.fetchNotifications();
          if (notifsData.notifications) {
            setNotifications(notifsData.notifications);
          }
        } catch (notifErr) {
          console.error('Failed to load user notifications:', notifErr);
        }

        const data = await projectApi.fetchProjects();
        const projList = data.projects || [];
        setProjects(projList);

        if (projList.length > 0) {
          let targetPid = null;
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('project_id')) {
              targetPid = Number(urlParams.get('project_id'));
            }
          }

          if (targetPid && projList.some(p => Number(p.project_id) === targetPid)) {
            await loadFromProject(targetPid);
          } else {
            // 1. Try to find an active (unfinished) project first
            const activeProj = projList.find(p => !Number(p.is_finished));
            if (activeProj) {
              await loadFromProject(activeProj.project_id);
            } else {
              // 2. If all projects are finished, load the newest project
              await loadFromProject(projList[0].project_id);
            }
          }
        } else {
          setTasks([]);
          setEstimatedBudget(0);
          setProjectCompleted(false);
          setCurrentProjectId(null);
          setCurrentProject(null);
          setProjectName('');
        }
      } catch (e) {
        console.error('Failed to load user project:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    init();
  }, []);

  async function addNotification(text) {
    const now = new Date();
    const time = `Today, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add locally immediately for instant UI response
    setNotifications((prev) => [{ id: uniqueId, text, time, read: false }, ...prev]);

    // Save to database asynchronously
    try {
      const data = await notificationApi.createNotification({ text, type: 'system' });
      // Update the local notification with the real database ID
      setNotifications((prev) =>
        prev.map(n => n.id === uniqueId ? { ...n, id: data.notif_id } : n)
      );
    } catch (err) {
      console.error("Failed to save notification:", err);
    }
  }

  // Reload notifications from the backend so a backend-created notification
  // (e.g. a confirmation created when a service request is sent) shows up.
  async function refreshNotifications() {
    try {
      const data = await notificationApi.fetchNotifications();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to refresh notifications:', err);
    }
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notificationApi.markRead().catch(err => console.error(err));
  }

  function toggleNotificationRead(id) {
    const n = notifications.find(notif => notif.id === id);
    if (!n) return;
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));

    // Toggle status on database (send ID to mark it read, or implement toggle endpoint if needed)
    if (!n.read) {
      notificationApi.markRead(id).catch(err => console.error(err));
    }
  }

  // ── LOAD PROJECT + TASKS FROM BACKEND ────────────────────────────────────────
  async function loadFromProject(projectId) {
    if (!projectId) return;
    setIsLoadingProject(true);
    try {
      const data = await projectApi.fetchProject(projectId);
      setCurrentProjectId(Number(projectId));
      setCurrentProject(data.project || null);
      setProjectName(data.project?.project_name || '');

      const STATUS_TO_CELL = { done: 1, in_progress: 2, blocked: 3 };

      const mapped = (data.tasks || []).map((t, idx) => {
        const days = {};
        (t.daily_statuses || []).forEach(({ date, status }) => {
          days[date] = STATUS_TO_CELL[status] ?? 0;
        });
        return {
          id: t.task_id,
          name: t.task_name,
          projectName: data.project?.project_name || '',
          color: TASK_COLORS[idx % TASK_COLORS.length],
          days,
          cost: Number(t.t_cost) || 0,
          budget: Number(t.task_budget) || 0,
          assignedSP: t.sp_name || t.assigned_sp || null,
          completed: !!Number(t.is_finished),
        };
      });

      setTasks(mapped);
      setNextId(mapped.length + 100);
      setEstimatedBudget(Number(data.project?.p_budget) || DEFAULT_BUDGET);
      setProjectCompleted(!!Number(data.project?.is_finished));

    } catch (e) {
      console.error('Failed to load project tasks:', e);
    } finally {
      setIsLoadingProject(false);
    }
  }

  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notificationApi.deleteNotification(id).catch(err => console.error(err));
  }

  // ── ADD TASK ──────────────────────────────────────────────────────────────────
  async function addTask(name, color, budget = 0) {
    const tempId = nextId;
    setTasks((ts) => [...ts, { id: tempId, name, projectName: projectName, color, days: {}, cost: 0, budget: Number(budget) || 0, assignedSP: null, completed: false }]); setNextId((n) => n + 1);
    addNotification(`New task <strong>${name}</strong> has been added to the project timeline`);

    if (!currentProjectId) return;

    try {
      const data = await taskApi.createTask({
        project_id: currentProjectId,
        task_name: name,
        task_budget: Number(budget) || 0,
      });
      setTasks((ts) => ts.map((t) => (t.id === tempId ? { ...t, id: data.task_id } : t)));
    } catch (err) {
      console.error('Failed to create task on backend:', err);
    }
  }

  // ── DELETE TASK ───────────────────────────────────────────────────────────────
  function deleteTask(id) {
    const task = tasks.find((t) => t.id === id);
    setTasks((ts) => ts.filter((t) => t.id !== id));
    if (task) {
      addNotification(`Task <strong>${task.name}</strong> has been removed from the timeline`);
    }
    taskApi.deleteTask(id).catch((err) => console.error('Failed to delete task on backend:', err));
  }

  // ── UPDATE TASK ──────────────────────────────────────────────────────────────
  function updateTask(id, updates) {
    const prev = tasks.find((t) => t.id === id);

    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    if (prev) {
      if (updates.cost !== undefined && updates.cost !== prev.cost) {
        addNotification(`Cost for task <strong>${prev.name}</strong> updated to <strong>LKR ${updates.cost.toLocaleString()}</strong>`);
      }
      if (updates.budget !== undefined && updates.budget !== prev.budget) {
        addNotification(`Estimated budget for task <strong>${prev.name}</strong> updated to <strong>LKR ${Number(updates.budget).toLocaleString()}</strong>`);
      }
      if (updates.assignedSP !== undefined && updates.assignedSP !== prev.assignedSP) {
        if (updates.assignedSP) {
          addNotification(`Request sent to <strong>${updates.assignedSP}</strong> for task <strong>${prev.name}</strong>`);
        } else if (prev.assignedSP) {
          addNotification(`Service provider unassigned from task <strong>${prev.name}</strong>`);
        }
      }
    }

    const payload = {};
    if (updates.name !== undefined) payload.task_name = updates.name;
    if (updates.addCost !== undefined) payload.add_cost = updates.addCost;
    if (updates.budget !== undefined) payload.task_budget = updates.budget;

    if (Object.keys(payload).length === 0) return;

    taskApi.updateTask(id, payload).catch((err) => console.error('Failed to update task on backend:', err));
  }

  // ── FINISH TASK (permanent — no unfreeze) ─────────────────────────────────
  function finishTask(id) {
    const task = tasks.find((t) => t.id === id);
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
    if (task) {
      addNotification(
        `Task <strong>${task.name}</strong> is completed. A task report is now available in the <a href="/dashboard/propertyowner/reports" class="font-semibold text-[#16a34a] hover:underline">Reports</a> page.`
      );
    }
    taskApi.finishTask(id).catch((err) => console.error('Failed to finish task:', err));
  }

  function assignSP(taskId, spName) { updateTask(taskId, { assignedSP: spName }); }
  function unassignSP(taskId) { updateTask(taskId, { assignedSP: null }); }

  const totalCost = useMemo(() => tasks.reduce((sum, t) => sum + (Number(t.cost) || 0), 0), [tasks]);
  const totalAllocatedBudget = useMemo(() => tasks.reduce((sum, t) => sum + (Number(t.budget) || 0), 0), [tasks]);
  const remainingBudget = estimatedBudget - totalCost;

  const value = {
    tasks,
    isLoaded,
    isLoadingProject,
    projects,
    currentProject,
    currentProjectId,
    projectName,
    refreshProjects,
    addTask,
    deleteTask,
    updateTask,
    finishTask,
    assignSP,
    unassignSP,
    loadFromProject,
    estimatedBudget,
    totalCost,
    totalAllocatedBudget,
    remainingBudget,
    projectCompleted,
    finishProject: async () => {
      setProjectCompleted(true);
      addNotification(`<strong>Project finished!</strong> Project marked as completed and settings locked.`);
      if (currentProjectId) {
        try {
          await projectApi.toggleFinishProject(currentProjectId);
          setProjects((prev) =>
            prev.map((p) =>
              Number(p.project_id) === Number(currentProjectId)
                ? { ...p, is_finished: 1 }
                : p
            )
          );
          setCurrentProject((prev) => (prev ? { ...prev, is_finished: 1 } : null));
        } catch (err) {
          console.error('Failed to finish project:', err);
        }
      }
    },
    unlockProject: async () => {
      setProjectCompleted(false);
      addNotification(`Project settings <strong>unlocked</strong> for further edits.`);
      if (currentProjectId) {
        try {
          await projectApi.toggleFinishProject(currentProjectId);
          setProjects((prev) =>
            prev.map((p) =>
              Number(p.project_id) === Number(currentProjectId)
                ? { ...p, is_finished: 0 }
                : p
            )
          );
          setCurrentProject((prev) => (prev ? { ...prev, is_finished: 0 } : null));
        } catch (err) {
          console.error('Failed to unlock project:', err);
        }
      }
    },
    notifications,
    addNotification,
    refreshNotifications,
    markAllNotificationsRead,
    toggleNotificationRead,
    deleteNotification,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider');
  return ctx;
}