import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { toggleUserAccount } from 'src/controllers/users/toggle-user-account';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();
  
  fastify.post('/toggle-user-account', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      }),
      body: z.object({
        value: z.boolean()
      })
    }
  }, async req => {
    await toggleUserAccount({
      id: req.params.userId,
      value: req.body.value,
      identityService: fastify.identityService,
      profileRepo: fastify.repos.profileRepo
    });
  });
};

export default routes;