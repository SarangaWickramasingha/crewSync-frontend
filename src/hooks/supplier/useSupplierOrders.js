import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/src/api';

export const ORDERS_KEY = ['supplier', 'orders'];

export function useOrders() {
  return useQuery({ queryKey: ORDERS_KEY, queryFn: supplierApi.fetchOrders });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) => supplierApi.updateOrderStatus(orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}
