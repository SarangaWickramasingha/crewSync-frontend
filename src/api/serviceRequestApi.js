import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_SERVICE_REQUEST_CREATE, API_SERVICE_REQUEST_TASK_PENDING } from '@/config/api';

export async function createServiceRequest(payload) {
  return unwrap(await request.post(API_SERVICE_REQUEST_CREATE, payload));
}

export async function fetchPendingServiceRequest(taskId) {
  return unwrap(await request.get(API_SERVICE_REQUEST_TASK_PENDING(taskId)));
}