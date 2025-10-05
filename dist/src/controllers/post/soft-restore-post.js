"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softRestorePost = softRestorePost;
async function softRestorePost(params) {
    return await params.transactionManager.execute(async (ctx) => {
        await params.postRepo.updateDeletedAt(params.id, null, ctx.sharedTx);
        await params.commentRepo.updateDeletedAt(params.id, null, ctx.sharedTx);
        return { success: true };
    });
}
