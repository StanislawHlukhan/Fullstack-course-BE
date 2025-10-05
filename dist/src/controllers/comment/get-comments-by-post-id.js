"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByPostId = getCommentsByPostId;
async function getCommentsByPostId(params) {
    const comments = await params.commentRepo.getCommentsByPostId(params.postId);
    if (!comments) {
        throw new Error('Comments not found');
    }
    return comments;
}
