import { z } from 'zod';
import { GetTagRespSchema } from './GetTagRespSchema';

export const GetTagsRespSchema = z.array(GetTagRespSchema);