import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import { API_SUPPLIER_PRODUCTS, API_SUPPLIER_PRODUCT_DELETE, API_SUPPLIER_ORDERS, API_SUPPLIER_ORDER_STATUS } from '@/config/api';

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

export async function fetchOrders() {
  try {
    const res = await request.get(API_SUPPLIER_ORDERS);
    const data = unwrap(res);
    return data?.orders ?? data?.data ?? [];
  } catch (e) {
    console.warn('fetchOrders fallback:', e.message);
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  return unwrap(await request.put(API_SUPPLIER_ORDER_STATUS(orderId), { status }));
}
