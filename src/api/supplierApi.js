import { request } from '@/src/lib/request';
import { unwrap } from '@/src/api/helpers';
import {
  API_SUPPLIER_PRODUCTS,
  API_SUPPLIER_PRODUCT_DELETE,
  API_SUPPLIER_ORDERS,
  API_SUPPLIER_ORDER_STATUS,
  API_SUPPLIER_PROFILE,
} from '@/config/api';

export async function fetchProducts() {
  return unwrap(await request.get(API_SUPPLIER_PRODUCTS)).products;
}

export async function saveProduct(payload) {
  return unwrap(await request.post(API_SUPPLIER_PRODUCTS, payload));
}

export async function deleteProduct(id) {
  return unwrap(await request.delete(API_SUPPLIER_PRODUCT_DELETE(id)));
}

export async function fetchOrders() {
  return unwrap(await request.get(API_SUPPLIER_ORDERS)).orders;
}

export async function updateOrderStatus(id, status) {
  return unwrap(await request.put(API_SUPPLIER_ORDER_STATUS(id), { status }));
}

export async function fetchProfile() {
  return unwrap(await request.get(API_SUPPLIER_PROFILE)).profile;
}

export async function updateProfile(payload) {
  return unwrap(await request.put(API_SUPPLIER_PROFILE, payload));
}
