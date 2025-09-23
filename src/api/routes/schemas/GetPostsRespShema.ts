
import { ESystemRole } from 'src/types/Profile';
import { z } from 'zod';

export const GetPostsRespSchema = z.object({
  posts: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    commentCount: z.number().optional(),
    comments: z.array(z.object({
      id: z.string().uuid(),
      text: z.string(),
      postId: z.string().uuid(),
      createdAt: z.date(),
      updatedAt: z.date(),
      createdBy: z.string().uuid(),
      deletedAt: z.date().nullable().optional()
    })).optional(),
    tags: z.array(z.object({
      id: z.string().uuid(),
      name: z.string(),
      createdAt: z.date(),
      updatedAt: z.date()
    })).optional(),
    deletedAt: z.coerce.date().nullable().optional(),
    createdBy: z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string(),
      dickSize: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
      subId: z.string(),
      systemRole: z.nativeEnum(ESystemRole),
      activatedAt: z.date().nullable().optional(),
      deletedAt: z.date().nullable().optional()
    })
  })),
  total: z.number()
});