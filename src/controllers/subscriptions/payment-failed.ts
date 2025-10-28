import { ISubscriptionRepo } from 'src/types/ISubscriptionRepo';

export async function paymentFailed(params: {
  subscriptionRepo: ISubscriptionRepo;
  customerId: string;
}) {
  const subscription = await params.subscriptionRepo.updateSubscriptionByCustomerId(params.customerId, { status: 'past_due' });
  return subscription;
}