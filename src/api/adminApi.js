import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';

export async function fetchAdminStats(config) {
  return unwrap(await request.get('/api/admin/stats', config));
}

export async function fetchAdminUsers(config) {
  return unwrap(await request.get('/api/admin/users', config));
}

export async function fetchAdminUser(id, config) {
  return unwrap(await request.get(`/api/admin/users/${id}`, config));
}

export async function createAdminUser(payload) {
  return unwrap(await request.post('/api/admin/users', payload));
}

export async function updateAdminUser(id, payload) {
  return unwrap(await request.put(`/api/admin/users/${id}`, payload));
}

export async function deleteAdminUser(id) {
  return unwrap(await request.delete(`/api/admin/users/${id}`));
}

export async function fetchPropertyOwners(config) {
  return unwrap(await request.get('/api/admin/users/property-owners', config));
}

export async function fetchMaterialSuppliers(config) {
  return unwrap(await request.get('/api/admin/users/material-suppliers', config));
}

export async function fetchServiceProviders(config) {
  return unwrap(await request.get('/api/admin/users/service-providers', config));
}

export async function fetchAdminFeedback(config) {
  return unwrap(await request.get('/api/admin/feedback', config));
}

export async function updateAdminFeedback(id, payload) {
  return unwrap(await request.put(`/api/admin/feedback/${id}`, payload));
}

export async function fetchAdminReviews(config) {
  return unwrap(await request.get('/api/admin/reviews', config));
}

export async function deleteAdminReview(id) {
  return unwrap(await request.delete(`/api/admin/reviews/${id}`));
}

export async function fetchAdminProjects(config) {
  return unwrap(await request.get('/api/admin/projects', config));
}

export async function fetchAdminProject(id, config) {
  return unwrap(await request.get(`/api/admin/projects/${id}`, config));
}
