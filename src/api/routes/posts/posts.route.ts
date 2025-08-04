import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getPosts } from 'src/controllers/post/get-posts';
import { createPost } from 'src/controllers/post/create-post';
import { CreatePostReqSchema } from '../schemas/CreatePostReqSchema';
import { PostSchema } from 'src/types/Post';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: PostSchema.array()
      }
    }
  }, async _ => {
    const posts = await getPosts({
      postRepo: fastify.repos.postRepo
    });

    return posts;
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