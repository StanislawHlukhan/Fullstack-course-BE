import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { processStripeWebhook } from 'src/controllers/subscriptions/process-stripe-webhook';
import fastifyRawBody from 'fastify-raw-body';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  await fastify.register(fastifyRawBody, {
    field: 'rawBody',   
    global: false,     
    encoding: 'utf8',
    runFirst: true
  });

  // Skip auth for this route
  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.config) {
      routeOptions.config = {};
    }
    routeOptions.config.skipAuth = true;
  });

  fastify.post('/', async (req, reply) => {
    await processStripeWebhook({
      request: req,
      reply,
      stripeService: fastify.stripeService
    });
  });
};

export default routes;