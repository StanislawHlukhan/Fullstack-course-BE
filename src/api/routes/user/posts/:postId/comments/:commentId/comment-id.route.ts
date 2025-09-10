import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateCommentByIdAndPostId } from 'src/controllers/comment/update-comment-by-id-and-post-id';
import { CreateCommentReqSchema } from 'src/api/routes/schemas/CreateCommentReqSchema';
import { z } from 'zod';
import { CommentSchema } from 'src/types/Comment';
import { ownershipHook } from 'src/api/hooks/ownership.hook';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    preHandler: ownershipHook,
    schema: {
      response: {
        200: CommentSchema
      },
      params: z.object({
        postId: z.string().uuid(),
        commentId: z.string().uuid()
      }),
      body: CreateCommentReqSchema
    }
  }, async req => {
    const comment = await updateCommentByIdAndPostId({
      commentRepo: fastify.repos.commentRepo,
      id: req.params.commentId,
      postId: req.params.postId,
      data: req.body
    });
    return comment ;
  });
};

export default routes;
  