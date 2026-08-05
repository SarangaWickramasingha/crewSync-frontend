import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/src/api';

export function useLogin() {
  return useMutation({ mutationFn: userApi.login });
}

export function useRegister() {
  return useMutation({ mutationFn: userApi.register });
}

export function useCheckEmail() {
  return useMutation({ mutationFn: ({ email }) => userApi.checkEmail(email) });
}
