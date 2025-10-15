import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';

export async function getActiveSubscription(params: {
  subscriptionRepo: ISubscriptionRepo;
  userId: string;
}) {
  const subscription = await params.subscriptionRepo.getActiveSubscriptionByUserId(params.userId);
  return subscription;
}