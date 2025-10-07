import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { GetUsersRespSchema } from '../../schemas/GetUsersRespShema';
import { getUsers } from 'src/controllers/users/get-users';
import { createUser } from 'src/controllers/users/create-user';
import { CreateUserReqSchema } from '../../schemas/CreateUserReqSchema';

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
      limit: req.query.limit,
      page: req.query.page,
      search: req.query.search
    });
    return users;
  });

  fastify.post('/create-user', {
    schema: {
      body: CreateUserReqSchema
    }
  }, async (req) => {
    const user = await createUser({
      identityService: fastify.identityService,
      profileRepo: fastify.repos.profileRepo,
      email: req.body.email,
      name: req.body.name,
      dickSize: req.body.dickSize
    });

    return user;
  });
};

export default routes;