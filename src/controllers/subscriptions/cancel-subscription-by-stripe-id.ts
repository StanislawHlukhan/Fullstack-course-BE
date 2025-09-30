import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';

export async function cancelSubscriptionByStripeId(params: {
  subscriptionRepo: ISubscriptionRepo;
  stripeSubscriptionId: string;
}) {
  const subscription = await params.subscriptionRepo.cancelSubscriptionByStripeId(params.stripeSubscriptionId);
  return subscription;
}