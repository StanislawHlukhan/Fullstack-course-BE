import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';  
import { createUser } from 'src/controllers/user/create-user';
import { CreateUserReqSchema } from '../../schemas/CreateUserReqSchema';
import { GetUserRespSchema } from '../../schemas/GetUserRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.config) {
      routeOptions.config = {};
    }
    routeOptions.config.skipAuth = true;
  });
  
  fastify.post('/', {
    schema: {
      body: CreateUserReqSchema,
      response: {
        200: GetUserRespSchema
      }
    }
  }, async (req) => {
    const user = await createUser({
      identityService: fastify.identityService,
      profileRepo: fastify.repos.profileRepo,
      email: req.body.email,
      name: req.body.name,
      dickSize: req.body.dickSize,
      password: req.body.password
    });
    
    return user;
  });
};

export default routes;