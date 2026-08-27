import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';

export const notificationApi = {
  fetchNotifications: async () => {
    const data = await request.get('/api/notifications');
    return unwrap(data);
  },
  
  createNotification: async (payload) => {
    const data = await request.post('/api/notifications', payload);
    return unwrap(data);
  },
  
  markRead: async (id = null) => {
    const data = await request.put('/api/notifications/read', { id });
    return unwrap(data);
  },
  
  deleteNotification: async (id) => {
    const data = await request.delete(`/api/notifications/${id}`);
    return unwrap(data);
  }
};