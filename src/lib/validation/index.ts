import zod from 'zod';

export const IsObjectID = (val: string) => {
  const validation = zod
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .safeParse(val);
  if (validation.success) return validation.data;
  throw new Error('Invalid Mongo Id');
};

export const IsEmail = (val: string) => {
  const validation = zod.string().email().safeParse(val);
  if (validation.success) return validation.data;
  throw new Error('Invalid Email');
};

export const IsDateString = (val: string) => {
  const validation = zod
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/)
    .safeParse(val);
  if (validation.success) return validation.data;
  throw new Error('Invalid Date String');
};

export const IsNotEmpty = (val: string) => {
  const validation = zod
    .string()
    .refine((val) => val !== '')
    .safeParse(val);
  if (validation.success) return validation.data;
  throw new Error('Invalid Empty String');
};

export const IsEnum = (val: string, enumType: any) => {
  const validation = zod.enum(enumType).safeParse(val);
  if (validation.success) return validation.data;
  throw new Error('Invalid Enum');
};

export const mailOptions = zod.object({
  from: zod.string(),
  to: zod.string().email(),
  subject: zod.string(),
  text: zod.string().optional(),
  html: zod.string(),
});

export type MailOptionsType = zod.infer<typeof mailOptions>;
