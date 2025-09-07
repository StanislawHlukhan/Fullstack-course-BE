import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { GetUsersRespSchema } from '../../schemas/GetUsersRespShema';
import { getUsers } from 'src/controllers/users/get-users';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: z.object({
        limit: z.coerce.number().int().positive().optional(),
        page: z.coerce.number().int().positive().optional(),
        search: z.string().optional()
      }),
      response: {
        200: GetUsersRespSchema
      }
    } 
  }, async (req) => {
    const users = await getUsers({
      profileRepo: fastify.repos.profileRepo,
      identityService: fastify.identityService,
      limit: req.query.limit || undefined,
      page: req.query.page || undefined,
      search: req.query.search || undefined
    });
    return users;
  });
};

export default routes;