import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createTag } from 'src/controllers/tags/create-tag';
import { getTags } from 'src/controllers/tags/get-tags';
import { TagSchema } from 'src/types/Tag';
import { CreateTagReqSchema } from '../../schemas/CreateTagReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
      schema: {
        response: {
          200: TagSchema.array()
        }
      }
    }, async () => {
    const tags = await getTags({
      tagRepo: fastify.repos.tagRepo
    });
    return tags;
  });

  fastify.post('/', {
    schema: {
      response: {
        200: TagSchema
      },
      body: CreateTagReqSchema
    }
  }, async (req) => {
    const tag = await createTag({
      tagRepo: fastify.repos.tagRepo,
      data: req.body
    });
    return tag;
  });
};

export default routes;