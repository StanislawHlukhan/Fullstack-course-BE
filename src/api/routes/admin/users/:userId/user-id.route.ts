import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { toggleUserAccount } from 'src/controllers/users/toggle-user-account';
import { sendInviteForUser } from 'src/controllers/users/send-invite-for-user';
import { softDeleteUser } from 'src/controllers/users/soft-delete-user';
import { softRestoreUser } from 'src/controllers/users/soft-restore-user';
import { PostWithProfileSchema } from 'src/types/PostWithProfile';
import { hardDeleteUser } from 'src/controllers/users/hard-delete-user';
import { hardRestoreUser } from 'src/controllers/users/hard-restore-user';
import { getPostsByProfileId } from 'src/controllers/post/get-posts-by-profile-id';

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

  fastify.delete('/hard-delete', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      })
    }
  }, async (req) => {
    await hardDeleteUser({
      repos: fastify.repos,
      userId: req.params.userId
    });
  });

  fastify.post('/hard-restore', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      })
    }
  }, async (req) => {
    await hardRestoreUser({
      repos: fastify.repos,
      userId: req.params.userId
    });
  });

  fastify.post('/soft-restore-user', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      })
    }
  }, async req => {
    await softRestoreUser({
      profileRepo: fastify.repos.profileRepo,
      id: req.params.userId
    });
  });
  
  fastify.delete('/soft-delete-user', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      })
    }
  }, async req => {
    await softDeleteUser({
      profileRepo: fastify.repos.profileRepo,
      id: req.params.userId
    });
  });

  // ASK FOR PROFILE ID
  fastify.get('/posts', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      }),
      response: {
        200: z.object({
          posts: PostWithProfileSchema.array(),
          total: z.number()
        })
      }
    }
  }, async (req) => {
    const result = await getPostsByProfileId({
      postRepo: fastify.repos.postRepo,
      profileId: req.params.userId
    });

    return result; 
  });
};

export default routes;