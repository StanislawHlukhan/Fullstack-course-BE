import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetMeRespSchema } from '../schemas/GetMeRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetMeRespSchema
      }
    }
  }, async req => {
    return req.profile;
  });
  
};

export default routes;