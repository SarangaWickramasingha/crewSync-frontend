import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';

export async function fetchNotifications() {
  const data = await request.get('/api/notifications');
  return unwrap(data);
}

export async function createNotification(payload) {
  const data = await request.post('/api/notifications', payload);
  return unwrap(data);
}

export async function markRead(id = null) {
  const data = await request.put('/api/notifications/read', { id });
  return unwrap(data);
}

export async function deleteNotification(id) {
  const data = await request.delete(`/api/notifications/${id}`);
  return unwrap(data);
}