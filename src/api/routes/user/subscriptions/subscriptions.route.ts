import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { GetPricingPlansResSchema } from '../../schemas/GetPricingPlansResSchema';
import { changeSubscription } from 'src/controllers/subscriptions/change-subscription';
import { createCheckoutSession } from 'src/controllers/subscriptions/create-checkout-session';
import { GetCheckoutSessionRespSchema } from '../../schemas/GetCheckoutSessionRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/pricing-plans', {
    schema: {
      response: {
        200: GetPricingPlansResSchema
      }
    }
  }, async () => {
    const plans = await fastify.repos.pricingPlanRepo.getPricingPlans();
    return plans;
  });

  fastify.post('/checkout-session', {
    schema: {
      body: z.object({
        priceId: z.string()
      }),
      response: {
        200: GetCheckoutSessionRespSchema
      }
    }
  }, async (req) => {
    return await createCheckoutSession({
      profileRepo: fastify.repos.profileRepo,
      userId: req.profile!.id,
      userEmail: req.profile!.email,
      priceId: req.body.priceId
    });
  });
  
  fastify.patch('/change-subscription', {
    schema: {
      body: z.object({
        priceId: z.string()
      })
    }
  }, async (req) => {
    const subscription = await changeSubscription({
      subscriptionRepo: fastify.repos.subscriptionRepo,
      userId: req.profile!.id,
      priceId: req.body.priceId
    });
    return subscription;
  });
};

export default routes;
