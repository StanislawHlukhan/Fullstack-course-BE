"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInviteForUser = sendInviteForUser;
async function sendInviteForUser(params) {
    const profile = await params.profileRepo.getProfileById(params.userId);
    if (!profile) {
        throw new Error('User not found');
    }
    const expireAtMs = Date.now() + params.inviteTTlMs;
    const hmacStr = `${profile.email}${params.userId}${expireAtMs}`;
    const signature = await params.cryptoService.getHMAC(hmacStr);
    const searchParams = new URLSearchParams({
        userId: profile.id,
        signature,
        expireAtMs: expireAtMs.toString(),
        email: profile.email
    });
    const url = `${process.env.FRONTEND_SIGNUP_URL}?${searchParams.toString()}`;
    await params.mailService.send(profile.email, process.env.FROM_EMAIL, process.env.SIGNUP_USER_TEMPLATE_ID, {
        url,
        name: profile.name
    });
}
