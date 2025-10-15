import { IStripeService } from 'src/types/IStripeService';
import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';

export async function changeSubscription(params: {
  subscriptionRepo: ISubscriptionRepo;
  userId: string;
  priceId: string;
  stripeService: IStripeService;
}) {
  const currentSubscription = await params.subscriptionRepo.getActiveSubscriptionByUserId(params.userId);
  if (!currentSubscription) {
    throw new Error('No active subscription');
  }
  const subscription = await params.stripeService.changeSubscription(currentSubscription!.stripeSubscriptionId, params.priceId);
  return subscription;
}