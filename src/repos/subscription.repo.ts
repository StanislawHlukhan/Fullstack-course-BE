import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { subscriptionTable } from 'src/services/drizzle/schema';
import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';
import { Subscription, SubscriptionSchema } from 'src/types/Subscription';

export const getSubscriptionRepo = (db: NodePgDatabase): ISubscriptionRepo => {
  return {
    async createSubscription(subscription) {
      const result = await db.insert(subscriptionTable).values(subscription as Subscription).returning();
      return SubscriptionSchema.parse(result[0]);
    },

    async updateSubscriptionByStripeId(stripeSubscriptionId, subscription) {
      const result = await db.update(subscriptionTable)
      .set(subscription as Subscription)
      .where(eq(subscriptionTable.stripeSubscriptionId, stripeSubscriptionId))
      .returning();
      return result[0] ? SubscriptionSchema.parse(result[0]) : null;
    },
    
    async cancelSubscriptionByStripeId(stripeSubscriptionId) {
      const result = await db.update(subscriptionTable).set({ status: 'canceled' }).where(eq(subscriptionTable.stripeSubscriptionId, stripeSubscriptionId)).returning();
      return SubscriptionSchema.parse(result[0]);
    },
    
    async updateSubscriptionByCustomerId(customerId, subscription) {
      const result = await db.update(subscriptionTable)
      .set(subscription as Subscription)
      .where(eq(subscriptionTable.stripeCustomerId, customerId))
      .returning();
      return result[0] ? SubscriptionSchema.parse(result[0]) : null;
    },

    async getSubscriptionByUserId(userId) {
      const result = await db.select().from(subscriptionTable).where(eq(subscriptionTable.userId, userId));
      return result[0] ? SubscriptionSchema.parse(result[0]) : null;
    },

    async getActiveSubscriptionByUserId(userId) {
      const result = await db.select()
        .from(subscriptionTable)
        .where(
          and(
            eq(subscriptionTable.userId, userId),
            eq(subscriptionTable.status, 'active')
          )
        );
      return result[0] ? SubscriptionSchema.parse(result[0]) : null;
    }
  };
};