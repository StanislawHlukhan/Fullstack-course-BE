"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const stripe_service_1 = require("src/services/stripe/stripe.service");
const GetPricingPlansResSchema_1 = require("../../schemas/GetPricingPlansResSchema");
const change_subscription_1 = require("src/controllers/subscriptions/change-subscription");
const GetCheckoutSessionRespSchema_1 = require("../../schemas/GetCheckoutSessionRespSchema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.get('/pricing-plans', {
        schema: {
            response: {
                200: GetPricingPlansResSchema_1.GetPricingPlansResSchema
            }
        }
    }, async () => {
        const plans = await fastify.repos.pricingPlanRepo.getPricingPlans();
        return plans;
    });
    fastify.post('/checkout-session', {
        schema: {
            body: zod_1.z.object({
                priceId: zod_1.z.string()
            }),
            response: {
                200: GetCheckoutSessionRespSchema_1.GetCheckoutSessionRespSchema
            }
        }
    }, async (req) => {
        const profile = await fastify.repos.profileRepo.getProfileById(req.profile.id);
        let customerId = profile?.stripeCustomerId || null;
        if (!customerId) {
            const customer = await stripe_service_1.stripeService.createCustomer(profile.email);
            customerId = customer.id;
            await fastify.repos.profileRepo.updateStripeCustomerId(req.profile.id, customerId);
        }
        const session = await stripe_service_1.stripeService.createCheckoutSession(customerId, req.body.priceId, req.profile.id);
        return { id: session.id, url: session.url };
    });
    fastify.patch('/change-subscription', {
        schema: {
            body: zod_1.z.object({
                priceId: zod_1.z.string()
            })
        }
    }, async (req) => {
        const subscription = await (0, change_subscription_1.changeSubscription)({
            subscriptionRepo: fastify.repos.subscriptionRepo,
            userId: req.profile.id,
            priceId: req.body.priceId
        });
        return subscription;
    });
};
exports.default = routes;
