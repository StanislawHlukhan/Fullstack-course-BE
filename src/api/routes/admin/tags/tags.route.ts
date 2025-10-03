import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createTag } from 'src/controllers/tags/create-tag';
import { getTags } from 'src/controllers/tags/get-tags';
import { CreateTagReqSchema } from '../../schemas/CreateTagReqSchema';
// CODE REVIVE: spelling: must be Schema not Shema 
import { GetTagsRespSchema } from '../../schemas/GetTagsRespShema';
import { GetTagRespSchema } from '../../schemas/GetTagRespShema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
      schema: {
        response: {
          200: GetTagsRespSchema
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
        200: GetTagRespSchema
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