"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cancel_subscription_by_stripe_id_1 = require("src/controllers/subscriptions/cancel-subscription-by-stripe-id");
const create_subscription_1 = require("src/controllers/subscriptions/create-subscription");
const payment_failed_1 = require("src/controllers/subscriptions/payment-failed");
const update_subscription_by_stripe_id_1 = require("src/controllers/subscriptions/update-subscription-by-stripe-id");
const stripe_service_1 = require("src/services/stripe/stripe.service");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    // Skip auth for this route
    fastify.addHook('onRoute', (routeOptions) => {
        if (!routeOptions.config) {
            routeOptions.config = {};
        }
        routeOptions.config.skipAuth = true;
    });
    fastify.post('/', async (request, reply) => {
        const signature = request.headers['stripe-signature'];
        if (!signature) {
            return reply.code(400).send({ error: 'Missing signature' });
        }
        try {
            const event = await stripe_service_1.stripeService.constructWebhookEvent(request.rawBody, signature);
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
                    await (0, create_subscription_1.createSubscription)({
                        subscriptionRepo: fastify.repos.subscriptionRepo,
                        pricingPlanRepo: fastify.repos.pricingPlanRepo,
                        data: {
                            userId: event.data.object.metadata.userId,
                            stripeSubscriptionId: event.data.object.id,
                            stripeCustomerId: event.data.object.customer,
                            stripePriceId: event.data.object.items.data[0].price.id,
                            status: event.data.object.status,
                            currentPeriodStart: new Date(event.data.object.items.data[0].current_period_start * 1000),
                            currentPeriodEnd: new Date(event.data.object.items.data[0].current_period_end * 1000),
                            cancelAtPeriodEnd: event.data.object.cancel_at_period_end
                        }
                    });
                    break;
                case 'customer.subscription.updated':
                    await (0, update_subscription_by_stripe_id_1.updateSubscriptionByStripeId)({
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
                    await (0, cancel_subscription_by_stripe_id_1.cancelSubscriptionByStripeId)({
                        subscriptionRepo: fastify.repos.subscriptionRepo,
                        stripeSubscriptionId: event.data.object.id
                    });
                    break;
                case 'invoice.payment_failed':
                    await (0, payment_failed_1.paymentFailed)({
                        subscriptionRepo: fastify.repos.subscriptionRepo,
                        customerId: event.data.object.customer
                    });
                    break;
            }
            await fastify.repos.webhookEventRepo.markWebhookProcessed(event.id);
            return reply.send({ received: true });
        }
        catch (error) {
            return reply.code(400).send({
                error: 'Webhook signature verification failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};
exports.default = routes;
