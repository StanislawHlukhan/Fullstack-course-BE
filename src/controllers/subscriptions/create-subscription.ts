import { IPricingPlanRepo } from 'src/types/IPricingPlanRepo';
import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';
import { Subscription } from 'src/types/Subscription';

export async function createSubscription(params: {
  subscriptionRepo: ISubscriptionRepo;
  pricingPlanRepo: IPricingPlanRepo;
  data: Partial<Subscription>;
}) {
  // STRIPE: Тут треба додати валідацію, щоб не було помилок. 
  const pricingPlan = await params.pricingPlanRepo.getPricingPlanByStripePriceId(params.data.stripePriceId!);
  const subscription = await params.subscriptionRepo.createSubscription({
    ...params.data,
    name: pricingPlan!.name
  });
  return subscription;
}