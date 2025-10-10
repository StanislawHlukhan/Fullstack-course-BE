import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';  
import { signupUser } from 'src/controllers/users/signup-user';
import { SignupReqSchema } from '../../schemas/SignupReqSchema';
import { GetUserRespSchema } from '../../schemas/GetUserRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.config) {
      routeOptions.config = {};
    }
    routeOptions.config.skipAuth = true;
  });
  
  fastify.post('/signup', {
    schema: {
      body: SignupReqSchema,
      response: {
        200: GetUserRespSchema
      }
    }
  }, async (req) => {
    const user = await signupUser({
      identityService: fastify.identityService,
      profileRepo: fastify.repos.profileRepo,
      email: req.body.email,
      name: req.body.name,
      footSize: req.body.footSize,
      password: req.body.password
    });
    
    return user;
  });
  
};

export default routes;