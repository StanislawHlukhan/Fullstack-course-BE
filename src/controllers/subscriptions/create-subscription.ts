import { IPricingPlanRepo } from 'src/types/IPricingPlanRepo';
import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';
import { Subscription } from 'src/types/Subscription';

export async function createSubscription(params: {
  subscriptionRepo: ISubscriptionRepo;
  pricingPlanRepo: IPricingPlanRepo;
  data: Partial<Subscription>;
}) {
  if (!params.data.stripePriceId) {
    throw new Error('Stripe price id is required');
  }
  const pricingPlan = await params.pricingPlanRepo.getPricingPlanByStripePriceId(params.data.stripePriceId);
  if (!pricingPlan) {
    throw new Error('Pricing plan not found');
  }
  const subscription = await params.subscriptionRepo.createSubscription({
    ...params.data,
    name: pricingPlan.name
  });
  return subscription;
}