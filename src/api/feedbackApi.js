import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_FEEDBACK_SUBMIT } from '@/config/api';

export async function submitFeedback(payload) {
  return unwrap(await request.post(API_FEEDBACK_SUBMIT, payload));
}
