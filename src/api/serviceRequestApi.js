import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_SERVICE_REQUEST_CREATE } from '@/config/api';

export async function createServiceRequest(payload) {
  return unwrap(await request.post(API_SERVICE_REQUEST_CREATE, payload));
}
