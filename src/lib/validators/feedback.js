import { z } from 'zod';

export const FEEDBACK_TYPES = [
  'General Inquiry',
  'Bug Report',
  'Suggestion / Feature Request',
  'Account Issue',
  'Payment Problem',
  'Other',
];

export const feedbackSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  email: z.string().trim().min(1, 'Please enter your email.').email('Enter a valid email.'),
  messageType: z.string().min(1, 'Please choose a message type.'),
  message: z.string().trim().min(1, 'Please enter a message.'),
});

export function toFeedbackPayload(values) {
  return {
    name: values.name,
    email: values.email,
    message_type: values.messageType,
    message: values.message,
  };
}
