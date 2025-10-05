"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingPlanSchema = void 0;
const zod_1 = require("zod");
exports.PricingPlanSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    stripePriceId: zod_1.z.string(),
    stripeProductId: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.string().transform((val) => parseFloat(val)),
    currency: zod_1.z.string(),
    interval: zod_1.z.string(),
    features: zod_1.z.array(zod_1.z.string()),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
