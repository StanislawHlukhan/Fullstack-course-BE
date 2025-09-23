import { z } from 'zod';
import { GetTagRespSchema } from './GetTagRespShema';

export const GetTagsRespSchema = z.array(GetTagRespSchema);