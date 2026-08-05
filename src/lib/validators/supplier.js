import { z } from 'zod';
import { MATERIAL_NAME_TO_ID } from '@/constants/registerMaps';

export const MATERIAL_TITLES = Object.keys(MATERIAL_NAME_TO_ID);

const parseNumber = (value) => {
  const cleaned = String(value ?? '').replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : NaN;
};

const parseQty = (value) => {
  const cleaned = String(value ?? '').replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

export const productSchema = z.object({
  material: z.string().min(1, 'Select a material'),
  description: z.string().max(200, 'Keep the description under 200 characters'),
  price: z
    .string()
    .min(1, 'Unit price is required')
    .refine((v) => parseNumber(v) > 0, 'Enter a valid price'),
  stockType: z.enum(['in', 'low', 'out']),
  stockNote: z.string(),
});

const MATERIAL_ID_TO_TITLE = Object.fromEntries(
  Object.entries(MATERIAL_NAME_TO_ID).map(([title, id]) => [id, title])
);

export function productToForm(product) {
  return {
    material: MATERIAL_ID_TO_TITLE[product.material_id] || MATERIAL_TITLES[0],
    description: product.description || '',
    price: product.price || '',
    stockType: product.stockType || 'in',
    stockNote: product.stockNote || '',
  };
}

export function toProductPayload(values) {
  return {
    material_id: MATERIAL_NAME_TO_ID[values.material],
    unit_price: parseNumber(values.price),
    stock_qty: parseQty(values.stockNote),
    description: values.description,
    is_available: values.stockType !== 'out',
  };
}

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  contactNumber: z.string().min(7, 'Enter a valid contact number'),
  district: z.string().min(1, 'Select a district'),
});

export const businessInfoSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessAddress: z.string().min(1, 'Business address is required'),
});

export const hardwareStoreSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  brNumber: z.string().min(1, 'BR number is required'),
  address: z.string().min(1, 'Address is required'),
});
