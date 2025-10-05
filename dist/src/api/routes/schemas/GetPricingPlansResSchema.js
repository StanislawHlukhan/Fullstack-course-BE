"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPricingPlansResSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.GetPricingPlansResSchema = zod_1.default.array(zod_1.default.object({
    id: zod_1.default.string().uuid(),
    stripePriceId: zod_1.default.string(),
    stripeProductId: zod_1.default.string(),
    name: zod_1.default.string(),
    description: zod_1.default.string().nullable().optional(),
    price: zod_1.default.number(),
    currency: zod_1.default.string(),
    interval: zod_1.default.string(),
    features: zod_1.default.array(zod_1.default.string()),
    isActive: zod_1.default.boolean(),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date()
}));
