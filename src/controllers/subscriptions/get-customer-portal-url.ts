import { IStripeService } from 'src/types/IStripeService';

export async function getCustomerPortalUrl(params: {
  stripeService: IStripeService;
  stripeCustomerId: string;
}) {
  const portalSession = await params.stripeService.createCustomerPortalSession(params.stripeCustomerId, `${process.env.FRONTEND_URL}/plans`);
  return portalSession.url;
}