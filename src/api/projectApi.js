import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import {
  API_PROJECTS,
  API_PROJECT,
  API_PROJECT_FINISH,
  API_PROJECT_CREATE,
  API_PROJECT_COMMENTS,
} from '@/config/api';

export async function fetchProjects() {
  return unwrap(await request.get(API_PROJECTS));
}

export async function fetchProject(projectId) {
  return unwrap(await request.get(API_PROJECT(projectId)));
}

export async function toggleFinishProject(projectId) {
  return unwrap(await request.put(API_PROJECT_FINISH(projectId)));
}

export async function createProject(payload) {
  return request.post(API_PROJECT_CREATE, payload);
}

export async function fetchComments(projectId) {
  return unwrap(await request.get(API_PROJECT_COMMENTS(projectId)));
}

export async function postComment(projectId, comment) {
  return unwrap(await request.post(API_PROJECT_COMMENTS(projectId), { comment }));
}
