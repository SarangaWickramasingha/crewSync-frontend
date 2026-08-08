import axios from 'axios';
import { API_BASE } from '@/config/api';

const request = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

request.interceptors.request.use((config) => {
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      (status === 401 ? 'Your session has expired. Please log in again.' : null) ||
      (status ? `Request failed (${status}).` : 'Could not reach the server. Please try again.');
    return Promise.reject(new Error(message));
  }
);

export default request;
export { request };
