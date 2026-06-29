'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const TasksContext = createContext(null);

const INIT_TASKS = [
  { id: 1, name: 'Site Preparation', color: '#1B6E3A', days: {}, cost: 0, assignedSP: null, completed: false },
  { id: 2, name: 'Foundation Work', color: '#E8820C', days: {}, cost: 0, assignedSP: null, completed: false },
  { id: 3, name: 'Structural Walls', color: '#1A56A0', days: {}, cost: 0, assignedSP: null, completed: false },
  { id: 4, name: 'Roofing', color: '#C0392B', days: {}, cost: 0, assignedSP: null, completed: false },
  { id: 5, name: 'Plumbing & Electrical', color: '#6B3FA0', days: {}, cost: 0, assignedSP: null, completed: false },
];

const INIT_NOTIFICATIONS = [
  {
    id: 1,
    text: '<strong>Sunil Karunaratne</strong> updated roofing task progress to 55%',
    time: 'Today, 10:42 AM',
    read: false,
  },
  {
    id: 2,
    text: '<strong>Payment released</strong> — LKR 680,000 for cement order to Malshan Hardware',
    time: 'Yesterday, 3:15 PM',
    read: false,
  },
  {
    id: 3,
    text: 'Task 2 (Structural Development) marked as <strong>Complete</strong>',
    time: 'May 1, 2026',
    read: true,
  },
  {
    id: 4,
    text: '<strong>Dinesh Wickrama</strong> accepted your carpenter request for Task 5',
    time: 'April 30, 2026',
    read: true,
  },
];

// Default budget shown before a real project is loaded
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

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('crewsync_tasks');
      const savedNextId = localStorage.getItem('crewsync_next_id');
      const savedCompleted = localStorage.getItem('crewsync_project_completed');
      const savedNotifs = localStorage.getItem('crewsync_notifications');
      const savedProjectId = localStorage.getItem('crewsync_project_id');

      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedNextId) setNextId(Number(savedNextId));
      if (savedCompleted) setProjectCompleted(savedCompleted === 'true');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      const savedBudget = localStorage.getItem('crewsync_budget');
      if (savedBudget) setEstimatedBudget(Number(savedBudget));
      if (savedProjectId) setCurrentProjectId(Number(savedProjectId));
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('crewsync_tasks', JSON.stringify(tasks));
      localStorage.setItem('crewsync_next_id', String(nextId));
      localStorage.setItem('crewsync_project_completed', String(projectCompleted));
      localStorage.setItem('crewsync_notifications', JSON.stringify(notifications));
      localStorage.setItem('crewsync_budget', String(estimatedBudget));
      if (currentProjectId) {
        localStorage.setItem('crewsync_project_id', String(currentProjectId));
      } else {
        localStorage.removeItem('crewsync_project_id');
      }
    }
  }, [tasks, nextId, projectCompleted, notifications, estimatedBudget, currentProjectId, isLoaded]);


  function addNotification(text) {
    const now = new Date();
    const time = `Today, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    const newNotif = {
      id: Date.now(),
      text,
      time,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function toggleNotificationRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }

  async function loadFromProject(projectId) {
    try {
      const res = await fetch(`http://localhost/CrewSync/backend/index.php/api/projects/${projectId}`);
      const data = await res.json();
      if (!data.success) return;

      setCurrentProjectId(projectId);

      // If project is currently in 'planning' status, auto-transition it to 'ongoing'
      if (data.project.status === 'planning') {
        try {
          await fetch(`http://localhost/CrewSync/backend/index.php/api/projects/${projectId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ongoing' }),
          });
        } catch (statusErr) {
          console.error('Failed to auto-transition project status to ongoing:', statusErr);
        }
      }

      // Map DB tasks to context task format
      const mapped = (data.tasks || []).map((t, idx) => ({
        id: t.task_id,
        name: t.task_name,
        color: TASK_COLORS[idx % TASK_COLORS.length],
        days: {},
        cost: 0,
        assignedSP: null,
        completed: t.status === 'completed',
      }));

      setTasks(mapped);
      setNextId(mapped.length + 100);
      setEstimatedBudget(Number(data.project.total_budget) || DEFAULT_BUDGET);
      setProjectCompleted(false);

      // Persist the freshly loaded project data
      if (typeof window !== 'undefined') {
        localStorage.setItem('crewsync_tasks', JSON.stringify(mapped));
        localStorage.setItem('crewsync_budget', String(data.project.total_budget));
        localStorage.setItem('crewsync_project_completed', 'false');
        localStorage.setItem('crewsync_project_id', String(projectId));
      }
    } catch (e) {
      console.error('Failed to load project tasks:', e);
    }
  }


  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function addTask(name, color) {
    setTasks((ts) => [...ts, { id: nextId, name, color, days: {}, cost: 0, assignedSP: null, completed: false }]);
    setNextId((n) => n + 1);
    addNotification(`New task <strong>${name}</strong> has been added to the project timeline`);
  }

  function deleteTask(id) {
    const task = tasks.find((t) => t.id === id);
    setTasks((ts) => ts.filter((t) => t.id !== id));
    if (task) {
      addNotification(`Task <strong>${task.name}</strong> has been removed from the timeline`);
    }
  }

  function updateTask(id, updates) {
    setTasks((ts) =>
      ts.map((t) => {
        if (t.id === id) {
          // Detect changes for notifications
          if (updates.cost !== undefined && updates.cost !== t.cost) {
            addNotification(`Cost for task <strong>${t.name}</strong> updated to <strong>LKR ${updates.cost.toLocaleString()}</strong>`);
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
  }

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
  }

  function assignSP(taskId, spName) {
    updateTask(taskId, { assignedSP: spName });
  }

  function unassignSP(taskId) {
    updateTask(taskId, { assignedSP: null });
  }

  const totalCost = useMemo(() => tasks.reduce((sum, t) => sum + (Number(t.cost) || 0), 0), [tasks]);
  const remainingBudget = estimatedBudget - totalCost;

  const value = {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    toggleTaskCompleted,
    assignSP,
    unassignSP,
    loadFromProject,
    estimatedBudget,
    totalCost,
    remainingBudget,
    projectCompleted,
    finishProject: async () => {
      setProjectCompleted(true);
      addNotification(`<strong>Project finished!</strong> Project marked as completed and settings locked.`);
      if (currentProjectId) {
        try {
          await fetch(`http://localhost/CrewSync/backend/index.php/api/projects/${currentProjectId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' }),
          });
        } catch (err) {
          console.error('Failed to update project status to completed:', err);
        }
      }
    },
    unlockProject: async () => {
      setProjectCompleted(false);
      addNotification(`Project settings <strong>unlocked</strong> for further edits.`);
      if (currentProjectId) {
        try {
          await fetch(`http://localhost/CrewSync/backend/index.php/api/projects/${currentProjectId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ongoing' }),
          });
        } catch (err) {
          console.error('Failed to update project status to ongoing:', err);
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