import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_TASKS, API_TASK, API_TASK_FINISH } from '@/config/api';

export async function createTask(payload) {
  return unwrap(await request.post(API_TASKS, payload));
}

export async function deleteTask(id) {
  return unwrap(await request.delete(API_TASK(id)));
}

export async function updateTask(id, payload) {
  return unwrap(await request.put(API_TASK(id), payload));
}

export async function toggleTaskFinish(id) {
  return unwrap(await request.put(API_TASK_FINISH(id)));
}
