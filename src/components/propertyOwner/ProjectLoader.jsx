'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTasks } from './TasksContext';

/**
 * Invisible client component that reads the ?project_id query param
 * from the URL and seeds the TasksContext with the real project data.
 * Renders nothing — purely side-effect based.
 */
export default function ProjectLoader() {
  const params = useSearchParams();
  const { loadFromProject } = useTasks();
  const projectId = params.get('project_id');

  useEffect(() => {
    if (projectId) {
      loadFromProject(Number(projectId));
    }
  }, [projectId]);

  return null;
}
