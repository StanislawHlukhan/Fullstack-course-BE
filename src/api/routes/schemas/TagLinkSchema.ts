import { z } from 'zod';

export const TagLinkSchema = z.object({
  postId: z.string().uuid(),
  tagId: z.string().uuid()
});
