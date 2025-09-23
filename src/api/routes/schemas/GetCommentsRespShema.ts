import { z } from 'zod';
import { GetCommentRespSchema } from './GetCommentRespShema';

export const GetCommentsRespSchema = z.array(GetCommentRespSchema);