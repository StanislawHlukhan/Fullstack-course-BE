import { z } from 'zod';

export const ArchiveSchema = z.object({
  id: z.string().uuid(),
  archivedUserId: z.string().uuid(),
  userData: z.any(),
  postsData: z.any(),
  commentsData: z.any(),
  tagsData: z.any(),
  createdAt: z.date()
});

export type Archive = z.infer<typeof ArchiveSchema>;