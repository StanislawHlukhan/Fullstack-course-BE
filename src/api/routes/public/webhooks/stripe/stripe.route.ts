import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { cancelSubscriptionByStripeId } from 'src/controllers/subscriptions/cancel-subscription-by-stripe-id';
import { createSubscription } from 'src/controllers/subscriptions/create-subscription';
import { paymentFailed } from 'src/controllers/subscriptions/payment-failed';
import { updateSubscriptionByStripeId } from 'src/controllers/subscriptions/update-subscription-by-stripe-id';
// STRIPE: імпорт сервіса
import { stripeService } from 'src/services/stripe/stripe.service';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  // Skip auth for this route
  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.config) {
      routeOptions.config = {};
    }
    routeOptions.config.skipAuth = true;
  });

  fastify.post('/', async (request, reply) => {
    const signature = request.headers['stripe-signature'] as string;
    
    if (!signature) {
      return reply.code(400).send({ error: 'Missing signature' });
    }

    // STRIPE: Це все бізнес логіка, вона має бути в контролері а не в роуті. 
    try {

      const event = await stripeService.constructWebhookEvent(
        request.rawBody as string,
        signature
      );

      const isProcessed = await fastify.repos.webhookEventRepo.isWebhookProcessed(event.id);
      if (isProcessed) {
        return reply.send({ received: true, duplicate: true });
      }

      await fastify.repos.webhookEventRepo.logWebhookEvent({
        eventId: event.id,
        eventType: event.type,
        data: event.data
      });

      switch (event.type) {
        case 'customer.subscription.created':
          await createSubscription({
            subscriptionRepo: fastify.repos.subscriptionRepo,
            pricingPlanRepo: fastify.repos.pricingPlanRepo,
            data: {
              userId: event.data.object.metadata.userId as string,
              stripeSubscriptionId: event.data.object.id,
              stripeCustomerId: event.data.object.customer as string,
              stripePriceId: event.data.object.items.data[0].price.id,
              status: event.data.object.status,
              currentPeriodStart: new Date(event.data.object.items.data[0].current_period_start * 1000),
              currentPeriodEnd: new Date(event.data.object.items.data[0].current_period_end * 1000),
              cancelAtPeriodEnd: event.data.object.cancel_at_period_end
            }
          });
          break;
        case 'customer.subscription.updated':
          await updateSubscriptionByStripeId({
            subscriptionRepo: fastify.repos.subscriptionRepo,
            stripeSubscriptionId: event.data.object.id,
            pricingPlanRepo: fastify.repos.pricingPlanRepo,
            data: {
              stripePriceId: event.data.object.items.data[0].price.id,
              status: event.data.object.status,
              currentPeriodStart: new Date(event.data.object.items.data[0].current_period_start * 1000),
              currentPeriodEnd: new Date(event.data.object.items.data[0].current_period_end * 1000),
              cancelAtPeriodEnd: event.data.object.cancel_at_period_end
            }
          });
          break;
        case 'customer.subscription.deleted':
          await cancelSubscriptionByStripeId({
            subscriptionRepo: fastify.repos.subscriptionRepo,
            stripeSubscriptionId: event.data.object.id
          });
          break;
        case 'invoice.payment_failed':
          await paymentFailed({
            subscriptionRepo: fastify.repos.subscriptionRepo,
            customerId: event.data.object.customer as string
          });
          break;
      }

      await fastify.repos.webhookEventRepo.markWebhookProcessed(event.id);
      return reply.send({ received: true });

    } catch (error) {
      return reply.code(400).send({ 
        error: 'Webhook signature verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

export default routes;