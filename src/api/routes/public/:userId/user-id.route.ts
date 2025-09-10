import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';  
import { acceptInvite } from 'src/controllers/users/accept-invite';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.config) {
      routeOptions.config = {};
    }
    routeOptions.config.skipAuth = true;
  });

  fastify.post('/accept-invite', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
        signature: z.string(),
        expireAtMs: z.number()
      }),
      params: z.object({
        userId: z.string().uuid()
      })
    }
  }, async req => {
    await acceptInvite({
      userId: req.params.userId,
      email: req.body.email,
      password: req.body.password,
      signature: req.body.signature,
      expireAtMs: req.body.expireAtMs,
      cryptoService: fastify.cryptoService,
      identityService: fastify.identityService,
      profileRepo: fastify.repos.profileRepo
    });
  });
};

export default routes;