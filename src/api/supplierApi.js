import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_SUPPLIER_PRODUCTS, API_SUPPLIER_PRODUCT_DELETE } from '@/config/api';

export async function fetchProducts() {
  try {
    const res = await request.get(API_SUPPLIER_PRODUCTS);
    const data = unwrap(res);
    return data?.products ?? data?.data ?? [];
  } catch (e) {
    console.warn('fetchProducts fallback:', e.message);
    return [];
  }
}

export async function saveProduct(payload) {
  return unwrap(await request.post(API_SUPPLIER_PRODUCTS, payload));
}

export async function deleteProduct(id) {
  return unwrap(await request.delete(API_SUPPLIER_PRODUCT_DELETE(id)));
}
