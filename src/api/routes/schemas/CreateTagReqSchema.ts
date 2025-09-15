import { z } from 'zod';

export const CreateTagReqSchema = z.object({
  name: z.string()
});