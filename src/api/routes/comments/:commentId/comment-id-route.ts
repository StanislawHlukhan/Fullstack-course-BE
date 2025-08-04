import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateComment } from 'src/controllers/comment/update-comment';
import { CreateCommentReqSchema } from '../../schemas/CreateCommentReqSchema';
import { z } from 'zod';
import { CommentSchema } from 'src/types/Comment';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      response: {
        200: CommentSchema
      },
      params: z.object({
        commentId: z.string().uuid()
      }),
      body: CreateCommentReqSchema
    }
  }, async req => {
    const comment = await updateComment({
      commentRepo: fastify.repos.commentRepo,
      id: req.params.commentId,
      data: req.body
    });
    return comment ;
  });
};

export default routes;
  