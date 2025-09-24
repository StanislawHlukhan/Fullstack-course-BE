import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPosts } from 'src/controllers/post/get-posts';
import { createPost } from 'src/controllers/post/create-post';
import { CreatePostReqSchema } from '../../schemas/CreatePostReqSchema';
import { z } from 'zod';
import { getSoftDeletedPosts } from 'src/controllers/post/get-soft-deleted-posts';
import { GetPostsRespSchema } from '../../schemas/GetPostsRespShema';
import { GetPostRespSchema } from 'src/api/routes/schemas/GetPostRespShema';
import { GetSoftDeletedPostsRespSchema } from 'src/api/routes/schemas/GetSoftDeletedPostsRespShema';

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
        commentCount: z.coerce.number().int().optional(),
        tagIds: z.array(z.string().uuid()).optional()
      }),
      response: {
        200: GetPostsRespSchema
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
        commentCount: req.query.commentCount || undefined,
        tagIds: req.query.tagIds || undefined
      }
    });

    return result; 
  });

  fastify.post('/', {
    schema: {
      response: {
        200: GetPostRespSchema
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

  fastify.get('/soft-deleted', {
    schema: {
      response: {
        200: GetSoftDeletedPostsRespSchema
      }
    }
  }, async () => {
    const posts = await getSoftDeletedPosts({
      postRepo: fastify.repos.postRepo
    });

    return posts;
  });
};

export default routes;