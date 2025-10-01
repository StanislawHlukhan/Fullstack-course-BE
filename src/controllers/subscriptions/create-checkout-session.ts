import { stripeService } from 'src/services/stripe/stripe.service';
import { IProfileRepo } from 'src/types/IProfileRepo';

export async function createCheckoutSession(params: {
  profileRepo: IProfileRepo;
  userId: string;
  userEmail: string;
  priceId: string;
}) {
  const profile = await params.profileRepo.getProfileById(params.userId);

  let customerId = profile?.stripeCustomerId || null;
  if (!customerId) {
    const customer = await stripeService.createCustomer(params.userEmail);
    customerId = customer.id;
    await params.profileRepo.updateStripeCustomerId(params.userId, customerId);
  }

  const session = await stripeService.createCheckoutSession(customerId, params.priceId, params.userId);
  return { id: session.id, url: session.url! };
}
