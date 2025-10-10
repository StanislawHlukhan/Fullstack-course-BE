import { z } from 'zod';

export const CreateUserReqSchema = z.object({
  email: z.string(),
  name: z.string(),
  footSize: z.coerce.number().int().positive()
});