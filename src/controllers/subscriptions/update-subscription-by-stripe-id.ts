import { IPricingPlanRepo } from 'src/types/IPricingPlanRepo';
import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';
import { Subscription } from 'src/types/Subscription';

export async function updateSubscriptionByStripeId(params: {
  subscriptionRepo: ISubscriptionRepo;
  stripeSubscriptionId: string;
  pricingPlanRepo: IPricingPlanRepo;
  data: Partial<Subscription>;
}) {
  const pricingPlan = await params.pricingPlanRepo.getPricingPlanByStripePriceId(params.data.stripePriceId!);
  const subscription = await params.subscriptionRepo.updateSubscriptionByStripeId(params.stripeSubscriptionId, {
    ...params.data,
    name: pricingPlan!.name
  });
  return subscription;
}