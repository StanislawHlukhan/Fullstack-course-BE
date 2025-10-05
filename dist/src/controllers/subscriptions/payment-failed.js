"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentFailed = paymentFailed;
async function paymentFailed(params) {
    const subscription = await params.subscriptionRepo.updateSubscriptionByCustomerId(params.customerId, { status: 'past_due' });
    return subscription;
}
