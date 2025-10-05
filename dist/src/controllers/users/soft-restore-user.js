"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softRestoreUser = softRestoreUser;
async function softRestoreUser(params) {
    return await params.transactionManager.execute(async (ctx) => {
        const profile = await params.profileRepo.getProfileById(params.id, ctx.sharedTx);
        if (!profile?.deletedAt) {
            throw new Error('Profile is not deleted');
        }
        await params.postRepo.updateDeletedAt(params.id, null, ctx.sharedTx);
        await params.commentRepo.updateDeletedAt(params.id, null, ctx.sharedTx);
        await params.profileRepo.updateDeletedAt(params.id, null, ctx.sharedTx);
        await params.identityService.toggleUserAccount(profile.subId, true);
    });
}
