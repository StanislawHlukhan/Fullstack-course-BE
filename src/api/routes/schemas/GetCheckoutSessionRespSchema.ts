import { z } from 'zod';

export const GetCheckoutSessionRespSchema = z.object({
  id: z.string(),
  url: z.string().url()
});