"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscriptionByStripeId = updateSubscriptionByStripeId;
async function updateSubscriptionByStripeId(params) {
    const pricingPlan = await params.pricingPlanRepo.getPricingPlanByStripePriceId(params.data.stripePriceId);
    const subscription = await params.subscriptionRepo.updateSubscriptionByStripeId(params.stripeSubscriptionId, {
        ...params.data,
        name: pricingPlan.name
    });
    return subscription;
}
