'use client';

import { useState, useEffect } from 'react';
import { projectApi, taskApi } from '@/src/api';
import { useTasks } from './TasksContext';

const TASK_COLORS = ['#E8820C', '#1B6E3A', '#1A56A0', '#C0392B', '#6B3FA0', '#2E7D9E', '#7B6E00'];
const STATUS_TO_CELL = { done: 1, in_progress: 2, blocked: 3 };

function mapTasks(tasks, projectName) {
  return (tasks || []).map((t, idx) => {
    const days = {};
    (t.daily_statuses || []).forEach(({ date, status }) => {
      days[date] = STATUS_TO_CELL[status] ?? 0;
    });
    return {
      id: t.task_id,
      name: t.task_name,
      projectName,
      color: TASK_COLORS[idx % TASK_COLORS.length],
      days,
      cost: Number(t.t_cost) || 0,
      budget: Number(t.task_budget) || 0,
      assignedSP: null,
      completed: !!Number(t.is_finished),
    };
  });
}

export default function useProjectTimelineData(projectId) {
  const ctx = useTasks();

  const [tasks, setTasks] = useState([]);
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [projectCompleted, setProjectCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const selfManaged = projectId != null;

  useEffect(() => {
    if (!selfManaged) return;
    let cancelled = false;
    projectApi
      .fetchProject(projectId)
      .then((data) => {
        if (cancelled) return;
        setTasks(mapTasks(data.tasks, data.project?.project_name || ''));
        setEstimatedBudget(Number(data.project.p_budget) || 0);
        setProjectCompleted(!!Number(data.project.is_finished));
        setIsLoaded(true);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to load project tasks:', err);
          setIsLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, selfManaged]);

  if (!selfManaged) {
    return ctx;
  }

  function addTask(name, color, budget = 0) {
    const tempId = Date.now();
    setTasks((ts) => [
      ...ts,
      { id: tempId, name, projectName: '', color, days: {}, cost: 0, budget: Number(budget) || 0, assignedSP: null, completed: false },
    ]);
    taskApi
      .createTask({ project_id: projectId, task_name: name, task_budget: Number(budget) || 0 })
      .then((data) => setTasks((ts) => ts.map((t) => (t.id === tempId ? { ...t, id: data.task_id } : t))))
      .catch((err) => console.error('Failed to create task on backend:', err));
  }

  function deleteTask(id) {
    setTasks((ts) => ts.filter((t) => t.id !== id));
    taskApi.deleteTask(id).catch((err) => console.error('Failed to delete task on backend:', err));
  }

  function updateTask(id, updates) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...updates } : t)));

    const payload = {};
    if (updates.name !== undefined) payload.task_name = updates.name;
    if (updates.addCost !== undefined) payload.add_cost = updates.addCost;
    if (updates.budget !== undefined) payload.task_budget = updates.budget;
    if (Object.keys(payload).length === 0) return;

    taskApi.updateTask(id, payload).catch((err) => console.error('Failed to update task on backend:', err));
  }

  function toggleTaskCompleted(id) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    taskApi.toggleTaskFinish(id).catch((err) => console.error('Failed to toggle task finish:', err));
  }

  async function finishProject() {
    setProjectCompleted(true);
    try {
      await projectApi.toggleFinishProject(projectId);
    } catch (err) {
      console.error('Failed to finish project:', err);
    }
  }

  async function unlockProject() {
    setProjectCompleted(false);
    try {
      await projectApi.toggleFinishProject(projectId);
    } catch (err) {
      console.error('Failed to unlock project:', err);
    }
  }

  const totalCost = tasks.reduce((sum, t) => sum + (Number(t.cost) || 0), 0);
  const totalAllocatedBudget = tasks.reduce((sum, t) => sum + (Number(t.budget) || 0), 0);
  const remainingBudget = estimatedBudget - totalCost;

  return {
    tasks,
    isLoaded,
    addTask,
    deleteTask,
    updateTask,
    toggleTaskCompleted,
    estimatedBudget,
    totalCost,
    totalAllocatedBudget,
    remainingBudget,
    projectCompleted,
    finishProject,
    unlockProject,
    addNotification: ctx.addNotification,
  };
}
