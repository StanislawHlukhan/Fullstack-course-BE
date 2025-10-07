import { z } from 'zod';
import { GetCommentRespSchema } from './GetCommentRespSchema';

export const GetCommentsRespSchema = z.array(GetCommentRespSchema);