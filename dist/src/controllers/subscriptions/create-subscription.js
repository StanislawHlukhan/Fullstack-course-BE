"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = createSubscription;
async function createSubscription(params) {
    const pricingPlan = await params.pricingPlanRepo.getPricingPlanByStripePriceId(params.data.stripePriceId);
    const subscription = await params.subscriptionRepo.createSubscription({
        ...params.data,
        name: pricingPlan.name
    });
    return subscription;
}
