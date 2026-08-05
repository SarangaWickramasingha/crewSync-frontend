import { z } from 'zod';

export const projectSchema = z
  .object({
    projName: z.string().min(1, 'Please enter a project name.'),
    projStartDate: z.string().min(1, 'Please enter a planned start date.'),
    projTargetDate: z.string().min(1, 'Please enter a target completion date.'),
    projDistrict: z.string().min(1, 'Please select your project district.'),
    projAddress: z.string().min(1, 'Please enter the site address.'),
    phases: z.array(z.string()).min(1, 'Please select at least one task.'),
    budget: z
      .string()
      .min(1, 'Please enter a valid estimated budget.')
      .refine((v) => Number(v) > 0, 'Please enter a valid estimated budget.'),
    agreeTerms: z.literal(true, { message: 'Please agree to the Terms of Service to continue.' }),
  })
  .refine((v) => !v.projTargetDate || !v.projStartDate || new Date(v.projTargetDate) > new Date(v.projStartDate), {
    message: 'Target completion date must be after the start date.',
    path: ['projTargetDate'],
  });

export const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle',
];

export function toProjectPayload(values) {
  return {
    title: values.projName,
    total_budget: values.budget,
    start_date: values.projStartDate,
    target_end_date: values.projTargetDate,
    district: values.projDistrict,
    address: values.projAddress,
    status: 'planning',
    tasks: values.phases,
  };
}
