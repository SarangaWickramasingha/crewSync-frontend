import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import {
  API_REPORTS_PROJECT,
  API_REPORT_TASK_GENERATE,
  API_REPORT_PROJECT_GENERATE,
} from '@/config/api';

export async function fetchProjectReports(projectId) {
  return unwrap(await request.get(API_REPORTS_PROJECT(projectId)));
}

export async function generateTaskReport(taskId) {
  return unwrap(await request.post(API_REPORT_TASK_GENERATE(taskId)));
}

export async function generateProjectReport(projectId) {
  return unwrap(await request.post(API_REPORT_PROJECT_GENERATE(projectId)));
}