"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeletePost = softDeletePost;
async function softDeletePost(params) {
    return await params.transactionManager.execute(async (ctx) => {
        await params.postRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
        await params.commentRepo.updateDeletedAt(params.id, new Date(), ctx.sharedTx);
        return { success: true };
    });
}
