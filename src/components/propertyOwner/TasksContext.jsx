'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { projectApi, taskApi } from '@/src/api';

const TasksContext = createContext(null);

const INIT_TASKS = [];
const INIT_NOTIFICATIONS = [];
const DEFAULT_BUDGET = 0;
const TASK_COLORS = ['#E8820C', '#1B6E3A', '#1A56A0', '#C0392B', '#6B3FA0', '#2E7D9E', '#7B6E00'];

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [nextId, setNextId] = useState(20);
  const [projectCompleted, setProjectCompleted] = useState(false);
  const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState(DEFAULT_BUDGET);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    // One-time cleanup of old test data cached in the browser
    if (typeof window !== 'undefined') {
      ['crewsync_tasks', 'crewsync_next_id', 'crewsync_project_completed',
        'crewsync_notifications', 'crewsync_budget', 'crewsync_project_id']
        .forEach((k) => localStorage.removeItem(k));
    }

    async function init() {
      try {
        // If the URL already has a project_id parameter (e.g. from redirect),
        // let ProjectLoader load that specific project instead of overriding it here.
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.has('project_id')) {
            return;
          }
        }

        const data = await projectApi.fetchProjects();
        if (data.projects?.length > 0) {
          // 1. Try to find an active (unfinished) project first
          const activeProj = data.projects.find(p => !p.is_finished);
          if (activeProj) {
            await loadFromProject(activeProj.project_id);
          } else {
            // 2. If all projects are finished, load the newest project
            // (assuming data.projects is sorted start_date DESC, projects[0] is the newest)
            await loadFromProject(data.projects[0].project_id);
          }
        } else {
          setTasks([]);
          setEstimatedBudget(0);
          setProjectCompleted(false);
          setCurrentProjectId(null);
        }
      } catch (e) {
        console.error('Failed to load user project:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    init();
  }, []);

  function addNotification(text) {
    const now = new Date();
    const time = `Today, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setNotifications((prev) => [{ id: uniqueId, text, time, read: false }, ...prev]);
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function toggleNotificationRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }

  // ── LOAD PROJECT + TASKS FROM BACKEND ────────────────────────────────────────
  async function loadFromProject(projectId) {
    try {
      const data = await projectApi.fetchProject(projectId);
      setCurrentProjectId(projectId);
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
          assignedSP: null,
          completed: !!Number(t.is_finished),
        };
      });

      setTasks(mapped);
      setNextId(mapped.length + 100);
      setEstimatedBudget(Number(data.project.p_budget) || DEFAULT_BUDGET);
      setProjectCompleted(!!Number(data.project.is_finished));

    } catch (e) {
      console.error('Failed to load project tasks:', e);
    }
  }

  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
    setTasks((ts) =>
      ts.map((t) => {
        if (t.id === id) {
          if (updates.cost !== undefined && updates.cost !== t.cost) {
            addNotification(`Cost for task <strong>${t.name}</strong> updated to <strong>LKR ${updates.cost.toLocaleString()}</strong>`);
          }
          if (updates.budget !== undefined && updates.budget !== t.budget) {
            addNotification(`Estimated budget for task <strong>${t.name}</strong> updated to <strong>LKR ${Number(updates.budget).toLocaleString()}</strong>`);
          }
          if (updates.assignedSP !== undefined && updates.assignedSP !== t.assignedSP) {
            if (updates.assignedSP) {
              addNotification(`Request sent to <strong>${updates.assignedSP}</strong> for task <strong>${t.name}</strong>`);
            } else if (t.assignedSP) {
              addNotification(`Service provider unassigned from task <strong>${t.name}</strong>`);
            }
          }
          return { ...t, ...updates };
        }
        return t;
      })
    );

    const payload = {};
    if (updates.name !== undefined) payload.task_name = updates.name;
    if (updates.addCost !== undefined) payload.add_cost = updates.addCost;
    if (updates.budget !== undefined) payload.task_budget = updates.budget;

    if (Object.keys(payload).length === 0) return;

    taskApi.updateTask(id, payload).catch((err) => console.error('Failed to update task on backend:', err));
  }

  // ── TOGGLE TASK COMPLETED ────────────────────────────────────────────────────
  function toggleTaskCompleted(id) {
    setTasks((ts) =>
      ts.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          addNotification(
            `Task <strong>${t.name}</strong> marked as <strong>${nextCompleted ? 'Complete' : 'In Progress'}</strong>`
          );
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
    taskApi.toggleTaskFinish(id).catch((err) => console.error('Failed to toggle task finish:', err));
  }

  function assignSP(taskId, spName) { updateTask(taskId, { assignedSP: spName }); }
  function unassignSP(taskId) { updateTask(taskId, { assignedSP: null }); }

  const totalCost = useMemo(() => tasks.reduce((sum, t) => sum + (Number(t.cost) || 0), 0), [tasks]);
  const totalAllocatedBudget = useMemo(() => tasks.reduce((sum, t) => sum + (Number(t.budget) || 0), 0), [tasks]);
  const remainingBudget = estimatedBudget - totalCost;

  const value = {
    tasks,
    isLoaded,
    projectName,
    addTask,
    currentProjectId,
    deleteTask,
    updateTask,
    toggleTaskCompleted,
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
        } catch (err) {
          console.error('Failed to unlock project:', err);
        }
      }
    },
    notifications,
    addNotification,
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