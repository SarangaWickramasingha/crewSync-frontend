import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/src/api';

export const PROFILE_KEY = ['supplier', 'profile'];

export function useProfile() {
  return useQuery({ queryKey: PROFILE_KEY, queryFn: supplierApi.fetchProfile });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supplierApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
  });
}
