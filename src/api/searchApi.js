import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_SEARCH_PROVIDERS } from '@/config/api';

export async function searchProviders(params = {}) {
  const data = await request.get(API_SEARCH_PROVIDERS, { params });
  return unwrap(data).providers;
}
