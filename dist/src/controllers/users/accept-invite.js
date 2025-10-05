"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvite = acceptInvite;
async function acceptInvite(params) {
    const hmacStr = `${params.email}${params.userId}${params.expireAtMs}`;
    const signatureToCheck = await params.cryptoService.getHMAC(hmacStr);
    if (signatureToCheck !== params.signature) {
        throw new Error('Invalid signature');
    }
    const profile = await params.profileRepo.getProfileById(params.userId);
    if (!profile) {
        throw new Error('Profile not found');
    }
    await params.identityService.setPassword(profile.subId, params.password);
    await params.profileRepo.updateActivatedAt(profile.id, new Date());
}
