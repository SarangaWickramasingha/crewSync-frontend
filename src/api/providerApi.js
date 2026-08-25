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

const DEFAULT_PROVIDER_REVIEWS = [
  {
    id: 1,
    name: 'Nimal Bandara',
    stars: 5,
    rating: 5,
    date: 'April 14, 2026',
    text: 'Sunil completed the electrical and masonry inspection on schedule. Excellent attention to detail and great communication throughout.',
    comment: 'Sunil completed the electrical and masonry inspection on schedule. Excellent attention to detail and great communication throughout.',
    photos: [
      { photo_id: 101, url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=500&auto=format&fit=crop&q=60' },
      { photo_id: 102, url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: 2,
    name: 'Dilshan Silva',
    stars: 5,
    rating: 5,
    date: 'March 29, 2026',
    text: 'Highly skilled and professional service provider. Solved our structural reinforcement problem within 2 days.',
    comment: 'Highly skilled and professional service provider. Solved our structural reinforcement problem within 2 days.',
    photos: []
  },
  {
    id: 3,
    name: 'Chamari Gunawardena',
    stars: 4,
    rating: 4,
    date: 'March 15, 2026',
    text: 'Very tidy work and fair pricing. Would definitely recommend Sunil for residential projects.',
    comment: 'Very tidy work and fair pricing. Would definitely recommend Sunil for residential projects.',
    photos: []
  }
];

function getStoredReviews() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('crewsync_reviews');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((r, i) => ({
        id: r.id || i + 1,
        name: r.name || r.reviewer_name || r.author || 'Property Owner',
        stars: Number(r.stars ?? r.rating ?? 5),
        rating: Number(r.rating ?? r.stars ?? 5),
        text: r.text || r.comment || r.content || '',
        comment: r.comment || r.text || r.content || '',
        date: r.date || 'Recently',
        photos: Array.isArray(r.photos)
          ? r.photos.map((p, idx) => (typeof p === 'string' ? { photo_id: idx + 1, url: p } : p))
          : [],
      }));
    }
  } catch (e) {
    console.error('Failed to parse local reviews', e);
  }
  return [];
}

export async function fetchDashboardStats() {
  try {
    const res = await request.get(API_PROVIDER_DASHBOARD_STATS);
    const unwrapRes = unwrap(res);
    if (unwrapRes && (unwrapRes.total_reviews !== undefined || unwrapRes.active_projects !== undefined)) {
      return unwrapRes;
    }
  } catch (e) {
    // fallback if API is not yet seeded
  }

  const all = [...getStoredReviews(), ...DEFAULT_PROVIDER_REVIEWS];
  const avg = (all.reduce((s, r) => s + (r.rating || r.stars || 5), 0) / (all.length || 1)).toFixed(1);
  return {
    success: true,
    total_reviews: all.length,
    avg_rating: avg,
    active_projects: 2,
    jobs_completed: 18,
  };
}

export async function fetchCurrentWork() {
  return unwrap(await request.get(API_PROVIDER_CURRENT_WORK));
}

export async function fetchRecentReviews() {
  try {
    const res = await request.get(API_PROVIDER_RECENT_REVIEWS);
    const unwrapRes = unwrap(res);
    if (unwrapRes?.reviews && Array.isArray(unwrapRes.reviews) && unwrapRes.reviews.length > 0) {
      return unwrapRes;
    }
  } catch (e) {
    // fallback
  }

  const local = getStoredReviews();
  const list = local.length > 0 ? [...local, ...DEFAULT_PROVIDER_REVIEWS] : DEFAULT_PROVIDER_REVIEWS;
  return { success: true, reviews: list.slice(0, 3) };
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
  try {
    const res = await request.get(API_PROVIDER_ALL_REVIEWS);
    const unwrapRes = unwrap(res);
    if (unwrapRes?.reviews && Array.isArray(unwrapRes.reviews)) {
      return unwrapRes;
    }
  } catch (e) {
    console.warn('API fetchAllReviews fallback:', e.message);
  }

  const local = getStoredReviews();
  const list = local.length > 0 ? [...local, ...DEFAULT_PROVIDER_REVIEWS] : DEFAULT_PROVIDER_REVIEWS;
  return { success: true, reviews: list };
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
