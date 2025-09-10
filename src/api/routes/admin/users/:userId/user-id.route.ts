import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { toggleUserAccount } from 'src/controllers/users/toggle-user-account';
import { sendInviteForUser } from 'src/controllers/users/send-invite-for-user';

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

  fastify.post('/send-invite-for-user', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      })
    }
  }, async req => {
    await sendInviteForUser({
      userId: req.params.userId,
      cryptoService: fastify.cryptoService,
      mailService: fastify.mailService,
      profileRepo: fastify.repos.profileRepo,
      inviteTTlMs: 1000 * 60 * 60 * 24 * 30
    });
  });
  
};

export default routes;