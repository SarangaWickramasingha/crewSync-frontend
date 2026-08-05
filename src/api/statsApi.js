import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_STATS_SUMMARY } from '@/config/api';

export async function fetchStatsSummary() {
  return unwrap(await request.get(API_STATS_SUMMARY));
}
