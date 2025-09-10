import { z } from 'zod';

export const SignupReqSchema = z.object({
  email: z.string(),
  name: z.string(),
  dickSize: z.coerce.number().int().positive(),
  password: z.string()
});