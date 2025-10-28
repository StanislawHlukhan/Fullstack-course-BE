import Stripe from 'stripe';

export interface IStripeService {
  createCustomer(email: string): Promise<Stripe.Customer>;
  createCheckoutSession(customerId: string, priceId: string, userId: string): Promise<Stripe.Checkout.Session>;
  changeSubscription(subscriptionId: string, priceId: string): Promise<Stripe.Subscription>;
  createCustomerPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session>;
  constructWebhookEvent(payload: string, signature: string): Promise<Stripe.Event>;
}