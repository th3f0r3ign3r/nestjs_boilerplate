import zod from 'zod';

export const mailOptions = zod.object({
  from: zod.string(),
  to: zod.string().email(),
  subject: zod.string(),
  text: zod.string().optional(),
  html: zod.string(),
});

export type MailOptionsType = zod.infer<typeof mailOptions>;
