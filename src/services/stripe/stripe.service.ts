import Stripe from 'stripe';
import { IStripeService } from 'src/types/IStripeService';

export function getStripeService(secretKey: string): IStripeService {
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil'
  });

  return {
    async createCustomer(email: string) {
      return await stripe.customers.create({ email });
    },

    async createCheckoutSession(customerId: string, priceId: string, userId: string) {
      return await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        // STRIPE: Чи ти обробляєш успішний і не успішний кейс на фронті?
        success_url: `${process.env.FRONTEND_URL}/plans`,
        cancel_url: `${process.env.FRONTEND_URL}/plans`,
        subscription_data: {
          metadata: { userId }
        }
      });
    },

    async changeSubscription(subscriptionId: string, priceId: string) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      return await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: priceId
        }],
        proration_behavior: 'create_prorations'
      });
    },

    async createCustomerPortalSession(customerId: string, returnUrl: string) {
      return await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      });
    },

    async constructWebhookEvent(payload: string, signature: string) {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    }
  };
}

export const stripeService = getStripeService(process.env.STRIPE_SECRET_KEY!);
