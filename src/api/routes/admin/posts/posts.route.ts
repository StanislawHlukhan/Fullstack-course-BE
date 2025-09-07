import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPosts } from 'src/controllers/post/get-posts';
import { createPost } from 'src/controllers/post/create-post';
import { CreatePostReqSchema } from '../../schemas/CreatePostReqSchema';
import { PostSchema } from 'src/types/Post';
import { z } from 'zod';
import { PostWithProfileSchema } from 'src/types/PostWithProfile';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: z.object({
        limit: z.coerce.number().int().positive().optional(),
        page: z.coerce.number().int().positive().optional(),
        search: z.string().optional(),
        sortBy: z.enum(['title', 'createdAt', 'commentCount']).nullable().optional(),
        sortOrder: z.enum(['asc', 'desc']).nullable().optional(),
        commentCount: z.coerce.number().int().optional()
      }),
      response: {
        200: z.object({
          posts: PostWithProfileSchema.array(),
          total: z.number()
        })
      }
    }
  }, async (req) => {
     const result = await getPosts({
      postRepo: fastify.repos.postRepo,
      options: {
        limit: req.query.limit || undefined,
        page: req.query.page || undefined,
        search: req.query.search,
        sortBy: req.query.sortBy || undefined,
        sortOrder: req.query.sortOrder || undefined,
        commentCount: req.query.commentCount || undefined
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
  }, async (req) => {
    const post = await createPost({
      postRepo: fastify.repos.postRepo,
      data: {
        ...req.body,
        createdBy: req.profile!.id
      }
    });

    return post;
  });
};

export default routes;