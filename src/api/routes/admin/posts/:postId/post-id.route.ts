import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { z } from 'zod';
import { CreatePostReqSchema } from 'src/api/routes/schemas/CreatePostReqSchema';
import { addTagToPost } from 'src/controllers/tags/add-tag-to-post';
import { removeTagFromPost } from 'src/controllers/tags/remove-tag-from-post';
import { softDeletePost } from 'src/controllers/post/soft-delete-post';
import { softRestorePost } from 'src/controllers/post/soft-restore-post';
import { GetPostRespSchema } from 'src/api/routes/schemas/GetPostRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      response: {
        200: GetPostRespSchema
      },
      params: z.object({
        postId: z.string()
      }),
      body: CreatePostReqSchema
    }
  }, async (req) => {
    const post = await updatePostById({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      data: req.body
    });

    return  post;
  });

  fastify.post('/add-tag-to-post', {
    schema: {
      response: {
        200: z.object({
          success: z.boolean()
        })
      },
      params: z.object({
        postId: z.string()
      }),
      body: z.object({
        tagIds: z.string().array()
      })
    }
  }, async (req) => {
    const post = await addTagToPost({
      tagToPostRepo: fastify.repos.tagToPostRepo,
      postId: req.params.postId,
      tagIds: req.body.tagIds
    });

    return post;
  });

  fastify.delete('/remove-tag-from-post', {
    schema: {
      response: {
        200: z.object({
          success: z.boolean()
        })
      },
      params: z.object({
        postId: z.string()
      }),
      body: z.object({
        tagIds: z.string().array()
      })
    }
  }, async (req) => {
    const post = await removeTagFromPost({
      tagToPostRepo: fastify.repos.tagToPostRepo,
      postId: req.params.postId,
      tagIds: req.body.tagIds
    });

    return post;
  });

  fastify.delete('/soft-delete', {
    schema: {
      params: z.object({
        postId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    }
  }, async (req) => {
    const post = await softDeletePost({
      postRepo: fastify.repos.postRepo,
      commentRepo: fastify.repos.commentRepo,
      transactionManager: fastify.transactionManager,
      id: req.params.postId
    });

    return post;
  });

  fastify.post('/soft-restore', {
    schema: {
      params: z.object({
        postId: z.string()
      }),
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    }
  }, async (req) => {
    const post = await softRestorePost({
      postRepo: fastify.repos.postRepo,
      commentRepo: fastify.repos.commentRepo,
      transactionManager: fastify.transactionManager,
      id: req.params.postId
    });

    return post;
  });
};

export default routes;