"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionRepo = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("src/services/drizzle/schema");
const Subscription_1 = require("src/types/Subscription");
const getSubscriptionRepo = (db) => {
    return {
        async createSubscription(subscription) {
            const result = await db.insert(schema_1.subscriptionTable).values(subscription).returning();
            return Subscription_1.SubscriptionSchema.parse(result[0]);
        },
        async updateSubscriptionByStripeId(stripeSubscriptionId, subscription) {
            const result = await db.update(schema_1.subscriptionTable)
                .set(subscription)
                .where((0, drizzle_orm_1.eq)(schema_1.subscriptionTable.stripeSubscriptionId, stripeSubscriptionId))
                .returning();
            return result[0] ? Subscription_1.SubscriptionSchema.parse(result[0]) : null;
        },
        async cancelSubscriptionByStripeId(stripeSubscriptionId) {
            const result = await db.update(schema_1.subscriptionTable).set({ status: 'canceled' }).where((0, drizzle_orm_1.eq)(schema_1.subscriptionTable.stripeSubscriptionId, stripeSubscriptionId)).returning();
            return Subscription_1.SubscriptionSchema.parse(result[0]);
        },
        async updateSubscriptionByCustomerId(customerId, subscription) {
            const result = await db.update(schema_1.subscriptionTable)
                .set(subscription)
                .where((0, drizzle_orm_1.eq)(schema_1.subscriptionTable.stripeCustomerId, customerId))
                .returning();
            return result[0] ? Subscription_1.SubscriptionSchema.parse(result[0]) : null;
        },
        async getSubscriptionByUserId(userId) {
            const result = await db.select().from(schema_1.subscriptionTable).where((0, drizzle_orm_1.eq)(schema_1.subscriptionTable.userId, userId));
            return result[0] ? Subscription_1.SubscriptionSchema.parse(result[0]) : null;
        },
        async getActiveSubscriptionByUserId(userId) {
            const result = await db.select()
                .from(schema_1.subscriptionTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subscriptionTable.userId, userId), (0, drizzle_orm_1.eq)(schema_1.subscriptionTable.status, 'active')));
            return result[0] ? Subscription_1.SubscriptionSchema.parse(result[0]) : null;
        }
    };
};
exports.getSubscriptionRepo = getSubscriptionRepo;
