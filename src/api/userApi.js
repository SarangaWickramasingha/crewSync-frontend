import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import {
  API_AUTH_LOGIN,
  API_AUTH_ME,
  API_AUTH_LOGOUT,
  API_AUTH_REGISTER,
  API_AUTH_CHECK_EMAIL,
} from '@/config/api';

export async function login({ email, password }) {
  const data = await request.post(API_AUTH_LOGIN, { email, password });
  return unwrap(data);
}

export async function getMe() {
  const data = await request.get(API_AUTH_ME);
  return unwrap(data);
}

export async function logout() {
  await request.post(API_AUTH_LOGOUT);
}

export async function register(payload) {
  const data = await request.post(API_AUTH_REGISTER, payload);
  return unwrap(data);
}

export async function checkEmail(email) {
  return request.post(API_AUTH_CHECK_EMAIL, { email });
}
