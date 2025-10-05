"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeSubscription = changeSubscription;
const stripe_service_1 = require("src/services/stripe/stripe.service");
async function changeSubscription(params) {
    const currentSubscription = await params.subscriptionRepo.getActiveSubscriptionByUserId(params.userId);
    const subscription = await stripe_service_1.stripeService.changeSubscription(currentSubscription.stripeSubscriptionId, params.priceId);
    return subscription;
}
