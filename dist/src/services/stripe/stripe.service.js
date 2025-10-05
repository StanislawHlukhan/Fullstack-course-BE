"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeService = void 0;
exports.getStripeService = getStripeService;
const stripe_1 = __importDefault(require("stripe"));
function getStripeService(secretKey) {
    const stripe = new stripe_1.default(secretKey, {
        apiVersion: '2025-08-27.basil'
    });
    return {
        async createCustomer(email) {
            return await stripe.customers.create({ email });
        },
        async createCheckoutSession(customerId, priceId, userId) {
            return await stripe.checkout.sessions.create({
                customer: customerId,
                payment_method_types: ['card'],
                line_items: [{ price: priceId, quantity: 1 }],
                mode: 'subscription',
                success_url: `${process.env.FRONTEND_URL}/plans`,
                cancel_url: `${process.env.FRONTEND_URL}/plans`,
                subscription_data: {
                    metadata: { userId }
                }
            });
        },
        async changeSubscription(subscriptionId, priceId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            return await stripe.subscriptions.update(subscriptionId, {
                items: [{
                        id: subscription.items.data[0].id,
                        price: priceId
                    }],
                proration_behavior: 'create_prorations'
            });
        },
        async createCustomerPortalSession(customerId, returnUrl) {
            return await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: returnUrl
            });
        },
        async constructWebhookEvent(payload, signature) {
            return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
        }
    };
}
exports.stripeService = getStripeService(process.env.STRIPE_SECRET_KEY);
