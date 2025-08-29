import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const MeRespSchema = z.object({
  email: z.string().optional().nullable(),
  subId: z.string(),
  name: z.string(),
  dickSize: z.number(),
  createdAt: z.date(),
  id: z.string().uuid()
});

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: MeRespSchema
      }
    }
  }, async req => {
    return req.profile;
  });
  
};

export default routes;