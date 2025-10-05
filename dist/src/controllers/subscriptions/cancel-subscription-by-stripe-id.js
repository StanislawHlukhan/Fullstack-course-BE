"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSubscriptionByStripeId = cancelSubscriptionByStripeId;
async function cancelSubscriptionByStripeId(params) {
    const subscription = await params.subscriptionRepo.cancelSubscriptionByStripeId(params.stripeSubscriptionId);
    return subscription;
}
