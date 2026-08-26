import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import {
  API_PROVIDER_TOGGLE_AVAILABILITY,
  API_PROVIDER_AVAILABILITY,
  API_PROVIDER_DASHBOARD_STATS,
  API_PROVIDER_CURRENT_WORK,
  API_PROVIDER_RECENT_REVIEWS,
  API_PROVIDER_JOB_REQUESTS,
  API_PROVIDER_JOB_REQUEST_RESPOND,
  API_PROVIDER_TIMELINE,
  API_PROVIDER_ALL_REVIEWS,
  API_REVIEW_PHOTOS_UPLOAD,
  API_REVIEW_PHOTO_DELETE,
  API_PROVIDER_PROFILE,
  API_PROVIDER_SKILLS,
  API_PROVIDER_SKILL_DELETE,
  API_PROVIDER_PUBLIC,
} from '@/config/api';

export async function fetchPublicProvider(id) {
  return unwrap(await request.get(API_PROVIDER_PUBLIC(id)));
}

export async function fetchAvailability() {
  return unwrap(await request.get(API_PROVIDER_AVAILABILITY));
}

export async function toggleAvailability() {
  return unwrap(await request.put(API_PROVIDER_TOGGLE_AVAILABILITY));
}

export async function fetchDashboardStats() {
  return unwrap(await request.get(API_PROVIDER_DASHBOARD_STATS));
}

export async function fetchCurrentWork() {
  return unwrap(await request.get(API_PROVIDER_CURRENT_WORK));
}

export async function fetchRecentReviews() {
  return unwrap(await request.get(API_PROVIDER_RECENT_REVIEWS));
}

export async function fetchJobRequests() {
  return unwrap(await request.get(API_PROVIDER_JOB_REQUESTS));
}

export async function respondToJobRequest(id, action) {
  return unwrap(await request.put(API_PROVIDER_JOB_REQUEST_RESPOND(id), { action }));
}

export async function fetchTimeline() {
  return unwrap(await request.get(API_PROVIDER_TIMELINE));
}

export async function fetchAllReviews() {
  return unwrap(await request.get(API_PROVIDER_ALL_REVIEWS));
}

export async function uploadReviewPhotos(reviewId, formData) {
  const res = await request.post(API_REVIEW_PHOTOS_UPLOAD(reviewId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(res);
}

export async function deleteReviewPhoto(photoId) {
  const res = await request.delete(API_REVIEW_PHOTO_DELETE(photoId));
  return unwrap(res);
}

export async function fetchProfile() {
  return unwrap(await request.get(API_PROVIDER_PROFILE));
}

export async function updateProfile(payload) {
  return unwrap(await request.put(API_PROVIDER_PROFILE, payload));
}

export async function saveSkill(payload) {
  return unwrap(await request.post(API_PROVIDER_SKILLS, payload));
}

export async function deleteSkill(skillId) {
  return unwrap(await request.delete(API_PROVIDER_SKILL_DELETE(skillId)));
}
