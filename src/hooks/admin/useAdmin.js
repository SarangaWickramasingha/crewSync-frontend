import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/src/api';

export const ADMIN_STATS_KEY = ['admin', 'stats'];
export const ADMIN_USERS_KEY = ['admin', 'users'];
export const ADMIN_USER_KEY = ['admin', 'user'];
export const PROPERTY_OWNERS_KEY = ['admin', 'property-owners'];
export const MATERIAL_SUPPLIERS_KEY = ['admin', 'material-suppliers'];
export const SERVICE_PROVIDERS_KEY = ['admin', 'service-providers'];
export const ADMIN_FEEDBACK_KEY = ['admin', 'feedback'];
export const ADMIN_REVIEWS_KEY = ['admin', 'reviews'];
export const ADMIN_PROJECTS_KEY = ['admin', 'projects'];
export const ADMIN_PROJECT_KEY = ['admin', 'project'];

export function useAdminStats() {
  return useQuery({ queryKey: ADMIN_STATS_KEY, queryFn: adminApi.fetchAdminStats });
}

export function useAdminUsers() {
  return useQuery({ queryKey: ADMIN_USERS_KEY, queryFn: adminApi.fetchAdminUsers });
}

export function useAdminUser(id) {
  return useQuery({
    queryKey: [...ADMIN_USER_KEY, id],
    queryFn: () => adminApi.fetchAdminUser(id),
    enabled: Boolean(id),
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createAdminUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY }),
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => adminApi.updateAdminUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_KEY });
      queryClient.invalidateQueries({ queryKey: PROPERTY_OWNERS_KEY });
      queryClient.invalidateQueries({ queryKey: MATERIAL_SUPPLIERS_KEY });
      queryClient.invalidateQueries({ queryKey: SERVICE_PROVIDERS_KEY });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: PROPERTY_OWNERS_KEY });
      queryClient.invalidateQueries({ queryKey: MATERIAL_SUPPLIERS_KEY });
      queryClient.invalidateQueries({ queryKey: SERVICE_PROVIDERS_KEY });
    },
  });
}

export function usePropertyOwners() {
  return useQuery({ queryKey: PROPERTY_OWNERS_KEY, queryFn: adminApi.fetchPropertyOwners });
}

export function useMaterialSuppliers() {
  return useQuery({ queryKey: MATERIAL_SUPPLIERS_KEY, queryFn: adminApi.fetchMaterialSuppliers });
}

export function useServiceProviders() {
  return useQuery({ queryKey: SERVICE_PROVIDERS_KEY, queryFn: adminApi.fetchServiceProviders });
}

export function useAdminFeedback() {
  return useQuery({ queryKey: ADMIN_FEEDBACK_KEY, queryFn: adminApi.fetchAdminFeedback });
}

export function useUpdateAdminFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => adminApi.updateAdminFeedback(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_FEEDBACK_KEY }),
  });
}

export function useAdminReviews() {
  return useQuery({ queryKey: ADMIN_REVIEWS_KEY, queryFn: adminApi.fetchAdminReviews });
}

export function useDeleteAdminReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteAdminReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY }),
  });
}

export function useAdminProjects() {
  return useQuery({ queryKey: ADMIN_PROJECTS_KEY, queryFn: adminApi.fetchAdminProjects });
}

export function useAdminProject(id) {
  return useQuery({
    queryKey: [...ADMIN_PROJECT_KEY, id],
    queryFn: () => adminApi.fetchAdminProject(id),
    enabled: Boolean(id),
  });
}
