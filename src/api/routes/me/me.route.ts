import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetMeRespSchema } from '../schemas/GetMeRespSchema';
import { getActiveSubscription } from 'src/controllers/subscriptions/get-active-subscription';
import { getCustomerPortalUrl } from 'src/controllers/subscriptions/get-customer-portal-url';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetMeRespSchema
      }
    }
  }, async req => {
   const subscription = await getActiveSubscription({
      subscriptionRepo: fastify.repos.subscriptionRepo,
      userId: req.profile!.id
    });

    return {
      ...req.profile!,
      subscription: subscription ? {
        name: subscription.name,
        expiresAt: subscription.currentPeriodEnd
      } : undefined
    };
  });
  
  fastify.get('/customer-portal-url', {
    schema: {
      response: {
        200: z.object({
          url: z.string().url()
        })
      }
    }
  }, async req => {
    const url = await getCustomerPortalUrl({
      stripeService: fastify.stripeService,
      stripeCustomerId: req.profile!.stripeCustomerId!
    });
    return { url };
  });
};

export default routes;