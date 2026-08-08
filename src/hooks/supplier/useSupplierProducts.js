import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/src/api';

export const PRODUCTS_KEY = ['supplier', 'products'];

export function useProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: supplierApi.fetchProducts });
}

export function useSaveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supplierApi.saveProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supplierApi.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}
