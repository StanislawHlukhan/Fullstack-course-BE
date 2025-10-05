"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserAccount = toggleUserAccount;
async function toggleUserAccount(params) {
    const profile = await params.profileRepo.getProfileById(params.id);
    if (!profile) {
        throw new Error('Profile not found');
    }
    await params.identityService.toggleUserAccount(profile.subId, params.value);
}
