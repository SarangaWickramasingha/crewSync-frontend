import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/src/api';

export const PROJECTS_KEY = ['projects'];
export const PROJECT_KEY = ['project'];
export const COMMENTS_KEY = ['comments'];

export function useProjects() {
  return useQuery({ queryKey: PROJECTS_KEY, queryFn: projectApi.fetchProjects });
}

export function useProject(projectId) {
  return useQuery({
    queryKey: [...PROJECT_KEY, projectId],
    queryFn: () => projectApi.fetchProject(projectId),
    enabled: Boolean(projectId),
  });
}

export function useToggleFinishProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectApi.toggleFinishProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
      queryClient.invalidateQueries({ queryKey: PROJECT_KEY });
    },
  });
}

export function useCreateProject() {
  return useMutation({ mutationFn: projectApi.createProject });
}

export function useComments(projectId) {
  return useQuery({
    queryKey: [...COMMENTS_KEY, projectId],
    queryFn: () => projectApi.fetchComments(projectId),
    enabled: Boolean(projectId),
  });
}

export function usePostComment(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment) => projectApi.postComment(projectId, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...COMMENTS_KEY, projectId] }),
  });
}
