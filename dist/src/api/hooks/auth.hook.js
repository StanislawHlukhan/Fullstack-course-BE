"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHook = void 0;
const HttpError_1 = require("../errors/HttpError");
const stripe_service_1 = require("src/services/stripe/stripe.service");
const TOKEN_HEADER_NAME = 'Authorization';
const authHook = async function (request) {
    if (request.routeOptions.config.skipAuth) {
        return;
    }
    try {
        const token = (request.headers[TOKEN_HEADER_NAME] || request.headers[TOKEN_HEADER_NAME.toLowerCase()]);
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
        let customerPortalUrl;
        if (profile.stripeCustomerId) {
            try {
                const portalSession = await stripe_service_1.stripeService.createCustomerPortalSession(profile.stripeCustomerId, `${process.env.FRONTEND_URL}/plans`);
                customerPortalUrl = portalSession.url;
            }
            catch (error) {
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
                customerPortalUrl: customerPortalUrl
            } : undefined
        };
    }
    catch (err) {
        throw new HttpError_1.HttpError(401, 'Auth err', err);
    }
};
exports.authHook = authHook;
