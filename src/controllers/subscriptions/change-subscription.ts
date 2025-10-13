import { stripeService } from 'src/services/stripe/stripe.service';
import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';

export async function changeSubscription(params: {
  subscriptionRepo: ISubscriptionRepo;
  userId: string;
  priceId: string;
}) {
  const currentSubscription = await params.subscriptionRepo.getActiveSubscriptionByUserId(params.userId);
  // STRIPE: Чому ти впевнений що в нього буде підписки? 
  const subscription = await stripeService.changeSubscription(currentSubscription!.stripeSubscriptionId, params.priceId);
  return subscription;
}