import { z } from 'zod';
import { UserWithPostsSchema } from './UserWithPostsSchema';

export const GetHardDeletedRespSchema = z.object({
  users: UserWithPostsSchema.array(),
  total: z.number()
});

