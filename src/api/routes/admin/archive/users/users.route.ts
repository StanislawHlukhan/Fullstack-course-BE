import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getSoftDeletedUsers } from 'src/controllers/users/get-soft-deleted-users';
import { GetUsersRespSchema } from 'src/api/routes/schemas/GetUsersRespShema';
import { getHardDeletedUsers } from 'src/controllers/users/get-hard-deleted-users';
import { GetHardDeletedRespSchema } from 'src/api/routes/schemas/GetHardDeletedRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/soft-deleted', {
    schema: {
      response: {
        200: GetUsersRespSchema
      }
    } 
  }, async () => {
    const users = await getSoftDeletedUsers({
      profileRepo: fastify.repos.profileRepo,
      identityService: fastify.identityService
    });
    return users;
  });

  fastify.get('/hard-deleted', {
    schema: {
      response: {
        200: GetHardDeletedRespSchema
      }
    }
  }, async () => {
    const result = await getHardDeletedUsers({
      repos: fastify.repos
    });
    return result;
  });

};

export default routes;