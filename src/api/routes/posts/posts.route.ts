import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPosts } from 'src/controllers/post/get-posts';
import { createPost } from 'src/controllers/post/create-post';
import { CreatePostReqSchema } from '../schemas/CreatePostReqSchema';
import { PostSchema } from 'src/types/Post';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: z.object({
        limit: z.string().optional(),
        page: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(['title', 'createdAt', 'commentCount']).nullable().optional(),
        sortOrder: z.enum(['asc', 'desc']).nullable().optional(),
        commentCount: z.string().optional()
        // z.coerce.number().int().positive().optional()
      }),
      response: {
        200: z.object({
          posts: PostSchema.array(),
          total: z.number()
        })
      }
    }
  }, async (req) => {
     const result = await getPosts({
      postRepo: fastify.repos.postRepo,
      options: {
        limit: Number(req.query.limit) || undefined,
        page: Number(req.query.page) || undefined,
        search: req.query.search,
        sortBy: req.query.sortBy || undefined,
        sortOrder: req.query.sortOrder || undefined,
        commentCount: Number(req.query.commentCount) || undefined
      }
    });

    return result; 
  });

  fastify.post('/', {
    schema: {
      response: {
        200: PostSchema
      },
      body: CreatePostReqSchema
    }
  }, async (reg) => {
    const post = await createPost({
      postRepo: fastify.repos.postRepo,
      data: reg.body
    });

    return post;
  });
};

export default routes;