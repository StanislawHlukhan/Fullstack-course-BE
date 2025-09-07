
import { z } from 'zod';
import { GetUserRespSchema } from './GetUserRespSchema';

export const GetUsersRespSchema = z.object({
 users: GetUserRespSchema.array(),
 total: z.number()
});