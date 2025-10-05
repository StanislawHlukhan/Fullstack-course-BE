"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SubscriptionSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
    userId: zod_1.default.string().uuid(),
    stripeSubscriptionId: zod_1.default.string(),
    stripeCustomerId: zod_1.default.string(),
    stripePriceId: zod_1.default.string(),
    name: zod_1.default.string(),
    status: zod_1.default.string(),
    currentPeriodStart: zod_1.default.date(),
    currentPeriodEnd: zod_1.default.date(),
    cancelAtPeriodEnd: zod_1.default.boolean(),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date()
});
