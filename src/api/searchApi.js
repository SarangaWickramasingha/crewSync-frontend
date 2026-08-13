import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_SEARCH_PROVIDERS, API_SEARCH_MATERIALS } from '@/config/api';

export async function searchProviders(params = {}) {
  const data = await request.get(API_SEARCH_PROVIDERS, { params });
  return unwrap(data).providers;
}

export async function searchMaterials(params = {}) {
  const data = await request.get(API_SEARCH_MATERIALS, { params });
  return unwrap(data).materials;
}
