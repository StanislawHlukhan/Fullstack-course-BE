import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { PostSchema } from 'src/types/Post';
import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { z } from 'zod';
import { CreatePostReqSchema } from 'src/api/routes/schemas/CreatePostReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      response: {
        200: PostSchema
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
};

export default routes;