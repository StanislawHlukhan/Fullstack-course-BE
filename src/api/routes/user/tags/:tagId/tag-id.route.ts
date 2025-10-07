  import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreateTagReqSchema } from 'src/api/routes/schemas/CreateTagReqSchema';
import { deleteTag } from 'src/controllers/tags/delete-tag';
import { updateTag } from 'src/controllers/tags/update-tag';
import { GetTagRespSchema } from 'src/api/routes/schemas/GetTagRespSchema';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      response: {
        200: GetTagRespSchema
      },
      params: z.object({
        tagId: z.string()
      }),
      body: CreateTagReqSchema
    }
  }, async (req) => {
    const tag = await updateTag({
      tagRepo: fastify.repos.tagRepo,
      id: req.params.tagId,
      data: req.body
    });
    return tag;
  });

  fastify.delete('/', {
    schema: {
      response: {
        200: z.object({
          success: z.boolean()
        })
      },
      params: z.object({
        tagId: z.string()
      })
    }
  }, async (req) => {
    const tag = await deleteTag({
      tagRepo: fastify.repos.tagRepo,
      tagToPostRepo: fastify.repos.tagToPostRepo,
      id: req.params.tagId
    });
    return tag;
  });

};

export default routes;