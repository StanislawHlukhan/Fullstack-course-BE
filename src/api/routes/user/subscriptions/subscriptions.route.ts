import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { stripeService } from 'src/services/stripe/stripe.service';
import { GetPricingPlansResSchema } from '../../schemas/GetPricingPlansResSchema';
import { changeSubscription } from 'src/controllers/subscriptions/change-subscription';
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

    const profile = await fastify.repos.profileRepo.getProfileById(req.profile!.id);

    let customerId = profile?.stripeCustomerId || null;
    if (!customerId) {
      const customer = await stripeService.createCustomer(profile!.email);
      customerId = customer.id;
      await fastify.repos.profileRepo.updateStripeCustomerId(req.profile!.id, customerId);
    }

    const session = await stripeService.createCheckoutSession(customerId, req.body.priceId, req.profile!.id);
    return { id: session.id, url: session.url! };
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
