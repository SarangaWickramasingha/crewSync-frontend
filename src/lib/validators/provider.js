import { z } from 'zod';
import { SKILL_NAME_TO_ID } from '@/constants/registerMaps';

export const providerProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  district: z.string().min(1, 'Select a district'),
  daily_rate: z
    .string()
    .min(1, 'Daily rate is required')
    .refine((v) => Number(v) > 0, 'Enter a valid daily rate'),
  bio: z.string(),
  out_region: z.boolean(),
});

export const skillSchema = z.object({
  skill: z.string().min(1, 'Select a skill category'),
  years: z.string().min(1),
  description: z.string(),
});

export const REVIEW_STATUS = ['New', 'Accepted', 'Declined'];

export function toProfileForm(profile) {
  return {
    full_name: profile.full_name || '',
    district: profile.district || '',
    daily_rate: profile.daily_rate ?? '',
    bio: profile.bio || '',
    out_region: profile.out_region || false,
  };
}

export function toSkillPayload(values) {
  return {
    skill_id: SKILL_NAME_TO_ID[values.skill],
    years: Number(values.years) || 1,
    description: values.description.trim(),
  };
}
