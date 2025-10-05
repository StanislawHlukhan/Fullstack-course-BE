"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPricingPlanRepo = void 0;
const schema_1 = require("src/services/drizzle/schema");
const PricingPlan_1 = require("src/types/PricingPlan");
const drizzle_orm_1 = require("drizzle-orm");
const getPricingPlanRepo = (db) => {
    return {
        async getPricingPlans() {
            const pricingPlans = await db.select().from(schema_1.pricingPlanTable);
            return PricingPlan_1.PricingPlanSchema.array().parse(pricingPlans);
        },
        async getPricingPlanByStripePriceId(stripePriceId) {
            const pricingPlan = await db.select()
                .from(schema_1.pricingPlanTable)
                .where((0, drizzle_orm_1.eq)(schema_1.pricingPlanTable.stripePriceId, stripePriceId))
                .limit(1);
            return pricingPlan[0] ? PricingPlan_1.PricingPlanSchema.parse(pricingPlan[0]) : null;
        }
    };
};
exports.getPricingPlanRepo = getPricingPlanRepo;
