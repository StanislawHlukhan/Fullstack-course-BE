import { Subscription } from './Subscription';

export interface ISubscriptionRepo {
  createSubscription(subscription: Partial<Subscription>): Promise<Subscription>;
  updateSubscriptionByStripeId(stripeSubscriptionId: string, subscription: Partial<Subscription>): Promise<Subscription | null>;
  cancelSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null>;
  updateSubscriptionByCustomerId(customerId: string, subscription: Partial<Subscription>): Promise<Subscription | null>;
  getSubscriptionByUserId(userId: string): Promise<Subscription | null>;
  getActiveSubscriptionByUserId(userId: string): Promise<Subscription | null>;
}