"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricingPlans = getPricingPlans;
async function getPricingPlans(params) {
    const pricingPlans = await params.pricingPlanRepo.getPricingPlans();
    return pricingPlans;
}
