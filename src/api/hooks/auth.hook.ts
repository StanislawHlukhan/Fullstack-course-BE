import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';
import { stripeService } from 'src/services/stripe/stripe.service';

const TOKEN_HEADER_NAME = 'Authorization';

export const authHook: preHandlerAsyncHookHandler = async function (request) {
  if (request.routeOptions.config.skipAuth) {
    return;
  }
  
  try {
    const token = (request.headers[TOKEN_HEADER_NAME] || request.headers[TOKEN_HEADER_NAME.toLowerCase()]) as string;
    if (!token) {
      throw new Error('No token');
    }
    // eslint-disable-next-line no-useless-escape
    const bearerTokenMatch = token.match(/Bearer\s+([A-Za-z0-9-._~+\/]+=*)$/);
    if (!bearerTokenMatch) {
      throw new Error('Token in wrong format');
    }

    const [, bearerToken] = bearerTokenMatch;
    const identityUser = await this.identityService.getUserByAccessToken(bearerToken);
    
    const profile = await this.repos.profileRepo.getProfileBySubId(identityUser.subId);
    if (!profile) {
      throw new Error('No profile');
    }

    const subscription = await this.repos.subscriptionRepo.getActiveSubscriptionByUserId(profile.id);
    
    let customerPortalUrl: string | undefined;
    if (profile.stripeCustomerId) {
      try {
        const portalSession = await stripeService.createCustomerPortalSession(
          profile.stripeCustomerId, 
          `${process.env.FRONTEND_URL}/plans`
        );
        customerPortalUrl = portalSession.url;
      } catch (error) {
        request.log.warn({ error, stripeCustomerId: profile.stripeCustomerId }, 'Failed to create customer portal session');
      }
    }
    
    request.log = request.log.child({ 
      identityUser
    });

    request.identityUser = identityUser;
    request.profile = {
      ...profile,
      subscription: subscription ? {
        name: subscription.name,
        expiresAt: subscription.currentPeriodEnd,
        customerPortalUrl: customerPortalUrl!
      } : undefined
    };
  } catch (err) {
    throw new HttpError(401, 'Auth err', err);
  }
};