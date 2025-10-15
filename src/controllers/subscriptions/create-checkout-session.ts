import { IProfileRepo } from 'src/types/IProfileRepo';
import { IStripeService } from 'src/types/IStripeService';

export async function createCheckoutSession(params: {
  profileRepo: IProfileRepo;
  userId: string;
  userEmail: string;
  priceId: string;
  stripeService: IStripeService;
}) {
  const profile = await params.profileRepo.getProfileById(params.userId);

  let customerId = profile?.stripeCustomerId || null;
  if (!customerId) {
    const customer = await params.stripeService.createCustomer(params.userEmail);
    customerId = customer.id;
    await params.profileRepo.updateStripeCustomerId(params.userId, customerId);
  }

  const session = await params.stripeService.createCheckoutSession(customerId, params.priceId, params.userId);
  return { id: session.id, url: session.url! };
}
