"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteUser = softDeleteUser;
async function softDeleteUser(params) {
    return await params.transactionManager.execute(async (ctx) => {
        const profile = await params.profileRepo.getProfileById(params.id, ctx.sharedTx);
        if (profile?.deletedAt) {
            throw new Error('Profile already deleted');
        }
        await params.profileRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
        await params.postRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
        await params.commentRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
        await params.identityService.toggleUserAccount(profile.subId, false);
    });
}
