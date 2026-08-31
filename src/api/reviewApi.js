import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_REVIEW_CREATE, API_REVIEW_MINE, API_REVIEW_ASSIGNED_PROVIDERS } from '@/config/api';

export async function createReview(payload) {
  return unwrap(await request.post(API_REVIEW_CREATE, payload));
}

export async function fetchMyReviews() {
  const data = await request.get(API_REVIEW_MINE);
  return unwrap(data);
}

export async function fetchAssignedProviders() {
  const data = await request.get(API_REVIEW_ASSIGNED_PROVIDERS);
  return unwrap(data);
}
