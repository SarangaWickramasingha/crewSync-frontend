import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { providerApi } from '@/src/api';

export const AVAILABILITY_KEY = ['provider', 'availability'];
export const STATS_KEY = ['provider', 'stats'];
export const CURRENT_WORK_KEY = ['provider', 'current-work'];
export const RECENT_REVIEWS_KEY = ['provider', 'recent-reviews'];
export const JOB_REQUESTS_KEY = ['provider', 'job-requests'];
export const TIMELINE_KEY = ['provider', 'timeline'];
export const ALL_REVIEWS_KEY = ['provider', 'reviews'];
export const PROFILE_KEY = ['provider', 'profile'];

export function useAvailability() {
  return useQuery({ queryKey: AVAILABILITY_KEY, queryFn: providerApi.fetchAvailability });
}

export function useToggleAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerApi.toggleAvailability,
    onSuccess: (data) => {
      queryClient.setQueryData(AVAILABILITY_KEY, data);
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY });
    },
  });
}

export function useDashboardStats() {
  return useQuery({ queryKey: STATS_KEY, queryFn: providerApi.fetchDashboardStats });
}

export function useCurrentWork() {
  return useQuery({ queryKey: CURRENT_WORK_KEY, queryFn: providerApi.fetchCurrentWork });
}

export function useRecentReviews() {
  return useQuery({ queryKey: RECENT_REVIEWS_KEY, queryFn: providerApi.fetchRecentReviews });
}

export function useJobRequests() {
  return useQuery({ queryKey: JOB_REQUESTS_KEY, queryFn: providerApi.fetchJobRequests });
}

export function useRespondToJobRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }) => providerApi.respondToJobRequest(id, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: JOB_REQUESTS_KEY }),
  });
}

export function useTimeline() {
  return useQuery({ queryKey: TIMELINE_KEY, queryFn: providerApi.fetchTimeline });
}

export function useAllReviews() {
  return useQuery({ queryKey: ALL_REVIEWS_KEY, queryFn: providerApi.fetchAllReviews });
}

export function useUploadReviewPhotos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, formData }) => providerApi.uploadReviewPhotos(reviewId, formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ALL_REVIEWS_KEY }),
  });
}

export function useDeleteReviewPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerApi.deleteReviewPhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ALL_REVIEWS_KEY }),
  });
}

export function useProfile() {
  return useQuery({ queryKey: PROFILE_KEY, queryFn: providerApi.fetchProfile });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
  });
}

export function useSaveSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerApi.saveSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerApi.deleteSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
  });
}
