import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/src/api';

export const PROFILE_KEY = ['supplier', 'profile'];

export function useSupplierProfile() {
  return useQuery({ queryKey: PROFILE_KEY, queryFn: supplierApi.fetchProfile });
}

export function useUpdateSupplierProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ section, data }) => supplierApi.updateProfile(section, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
  });
}
