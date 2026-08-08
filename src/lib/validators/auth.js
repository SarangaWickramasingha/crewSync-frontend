import { z } from 'zod';
import { MATERIAL_NAME_TO_ID, ROLE_MAP, SKILL_NAME_TO_ID } from '@/constants/registerMaps';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
});

export const registerCredsSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const adminUserSchema = z.object({
  fname: z.string().min(1, 'First name is required'),
  lname: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  mobile: z.string().min(1, 'Mobile number is required'),
  district: z.string().min(1, 'Select a district'),
  role: z.string(),
});

export const adminCreateUserSchema = z
  .object({
    fname: z.string().min(1, 'First name is required'),
    lname: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    contact_no: z.string().min(1, 'Contact number is required'),
    district: z.string().min(1, 'Select a district'),
    address: z.string(),
    bio: z.string(),
    experience_yr: z.string(),
    charge_per_day: z.string(),
    willing_outside_region: z.boolean(),
    business_name: z.string(),
    business_address: z.string(),
    is_hardware_shop: z.boolean(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const REQUIRED_PERSONAL = ['firstName', 'lastName', 'mobile'];

export const registerFormSchema = z
  .object({
    role: z.enum(['owner', 'provider', 'supplier']),
    email: z.string().min(1, 'Enter a valid email address').email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    mobile: z.string(),
    district: z.string(),
    address: z.string(),
    agreeTerms: z.boolean(),
    agreeVerification: z.boolean(),
    skills: z.array(z.string()),
    dailyRate: z.string(),
    workOutsideRegion: z.boolean(),
    bio: z.string(),
    businessName: z.string(),
    brn: z.string(),
    city: z.string(),
    delivery: z.boolean(),
    materials: z.array(z.string()),
    hasHardwareStore: z.boolean(),
    hwStoreName: z.string(),
    hwBRN: z.string(),
    hwAddress: z.string(),
  })
  .superRefine((values, ctx) => {
    const { role } = values;

    if (values.password !== values.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match' });
    }

    for (const field of REQUIRED_PERSONAL) {
      if (!values[field]?.trim()) {
        ctx.addIssue({ code: 'custom', path: [field], message: 'Please fill in all required fields.' });
      }
    }

    if (role !== 'supplier' && !values.district) {
      ctx.addIssue({ code: 'custom', path: ['district'], message: 'Please fill in all required fields.' });
    }

    if (role === 'supplier') {
      if (!values.district) {
        ctx.addIssue({ code: 'custom', path: ['district'], message: 'Please select your district.' });
      }
      if (!values.businessName?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['businessName'], message: 'Please enter your business name.' });
      }
      if (!values.address?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['address'], message: 'Please enter your business address.' });
      }
      if (!values.materials?.length) {
        ctx.addIssue({ code: 'custom', path: ['materials'], message: 'Please select at least one material you supply.' });
      }
    }

    if (!values.agreeTerms) {
      ctx.addIssue({ code: 'custom', path: ['agreeTerms'], message: 'You must agree to the Terms of Service to continue.' });
    }
  });

export const REGISTER_DEFAULT_VALUES = {
  role: 'owner',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  mobile: '',
  district: '',
  address: '',
  agreeTerms: false,
  agreeVerification: false,
  skills: [],
  dailyRate: '',
  workOutsideRegion: false,
  bio: '',
  businessName: '',
  brn: '',
  city: '',
  delivery: false,
  materials: [],
  hasHardwareStore: false,
  hwStoreName: '',
  hwBRN: '',
  hwAddress: '',
};

export function toRegisterPayload(values) {
  const payload = {
    email: values.email.trim().toLowerCase(),
    password: values.password,
    role: ROLE_MAP[values.role],
    fname: values.firstName.trim(),
    lname: values.lastName.trim(),
    contact_no: values.mobile.trim(),
    district: values.district,
  };

  if (values.role === 'owner') {
    payload.address = values.address?.trim() ?? '';
  }

  if (values.role === 'provider') {
    payload.bio = values.bio?.trim() ?? '';
    payload.charge_per_day = values.dailyRate ?? null;
    payload.willing_outside_region = values.workOutsideRegion ? 1 : 0;
    payload.skill_ids = (values.skills || [])
      .map((name) => SKILL_NAME_TO_ID[name])
      .filter(Boolean);
  }

  if (values.role === 'supplier') {
    payload.business_name = values.businessName?.trim() ?? '';
    payload.business_address = values.address?.trim() ?? '';
    payload.brn = values.brn?.trim() ?? '';
    payload.delivery = values.delivery ? 1 : 0;
    payload.is_hardware_shop = values.hasHardwareStore ? 1 : 0;
    payload.material_ids = (values.materials || [])
      .map((name) => MATERIAL_NAME_TO_ID[name])
      .filter(Boolean);
    if (values.hasHardwareStore) {
      payload.hw_store_name = values.hwStoreName?.trim() ?? '';
      payload.hw_br_number = values.hwBRN?.trim() ?? '';
      payload.hw_address = values.hwAddress?.trim() ?? '';
    }
  }

  return payload;
}
