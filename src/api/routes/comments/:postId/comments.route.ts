import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createComment } from 'src/controllers/comment/create-comment';
import { z } from 'zod';
import { CreateCommentReqSchema } from '../../schemas/CreateCommentReqSchema';
import { getCommentsByPostId } from 'src/controllers/comment/get-comments-by-post-id';
import { CommentSchema } from 'src/types/Comment';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      response: {
        200: CommentSchema
      },
      params: z.object({
        postId: z.string().uuid()
      }),
      body: CreateCommentReqSchema
    }
  }, async req => {
    const comment = await createComment({
      commentRepo: fastify.repos.commentRepo,
      data: req.body,
      postId: req.params.postId
    });
    return comment;
  });

  fastify.get('/', {
    schema: {
      response: {
        200: CommentSchema.array()
      },
      params: z.object({
        postId: z.string().uuid()
      })
    }
   }, async req => {
    const comments = await getCommentsByPostId({
      commentRepo: fastify.repos.commentRepo,
      postId: req.params.postId
    });
    return comments;
   });
};

export default routes; 