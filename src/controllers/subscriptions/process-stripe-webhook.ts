import { FastifyRequest, FastifyReply } from 'fastify';
import { cancelSubscriptionByStripeId } from './cancel-subscription-by-stripe-id';
import { createSubscription } from './create-subscription';
import { paymentFailed } from './payment-failed';
import { updateSubscriptionByStripeId } from './update-subscription-by-stripe-id';
import { IStripeService } from 'src/types/IStripeService';

export async function processStripeWebhook(params: {
  request: FastifyRequest,
  reply: FastifyReply,
  stripeService: IStripeService
}) {
  const { request, reply, stripeService } = params;
  const signature = request.headers['stripe-signature'] as string;
  
  if (!signature) {
    return reply.code(400).send({ error: 'Missing signature' });
  }

  try {
    const event = await stripeService.constructWebhookEvent(
      request.rawBody as string,
      signature
    );

    const isProcessed = await request.server.repos.webhookEventRepo.isWebhookProcessed(event.id);
    if (isProcessed) {
      return reply.send({ received: true, duplicate: true });
    }

    await request.server.repos.webhookEventRepo.logWebhookEvent({
      eventId: event.id,
      eventType: event.type,
      data: event.data
    });

    switch (event.type) {
      case 'customer.subscription.created':
        await createSubscription({
          subscriptionRepo: request.server.repos.subscriptionRepo,
          pricingPlanRepo: request.server.repos.pricingPlanRepo,
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
          subscriptionRepo: request.server.repos.subscriptionRepo,
          stripeSubscriptionId: event.data.object.id,
          pricingPlanRepo: request.server.repos.pricingPlanRepo,
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
          subscriptionRepo: request.server.repos.subscriptionRepo,
          stripeSubscriptionId: event.data.object.id
        });
        break;
      case 'invoice.payment_failed':
        await paymentFailed({
          subscriptionRepo: request.server.repos.subscriptionRepo,
          customerId: event.data.object.customer as string
        });
        break;
    }

    await request.server.repos.webhookEventRepo.markWebhookProcessed(event.id);
    return reply.send({ received: true });

  } catch (error) {
    return reply.code(400).send({ 
      error: 'Webhook signature verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
