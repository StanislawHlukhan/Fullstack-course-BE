import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { pricingPlanTable } from 'src/services/drizzle/schema';
import { IPricingPlanRepo } from 'src/types/IPricingPlanRepo';
import { PricingPlanSchema } from 'src/types/PricingPlan';
import { eq } from 'drizzle-orm';

export const getPricingPlanRepo = (db: NodePgDatabase): IPricingPlanRepo => {
  return {
    async getPricingPlans() {
      const pricingPlans = await db.select().from(pricingPlanTable);
      return PricingPlanSchema.array().parse(pricingPlans);
    },

    async getPricingPlanByStripePriceId(stripePriceId: string) {
      const pricingPlan = await db.select()
      .from(pricingPlanTable)
      .where(eq(pricingPlanTable.stripePriceId, stripePriceId))
      .limit(1);
      return pricingPlan[0] ? PricingPlanSchema.parse(pricingPlan[0]) : null;
    }
  };
};