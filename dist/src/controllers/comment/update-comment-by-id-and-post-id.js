"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentByIdAndPostId = updateCommentByIdAndPostId;
async function updateCommentByIdAndPostId(params) {
    const comment = await params.commentRepo.updateCommentByIdAndPostId(params.id, params.postId, params.data);
    if (!comment) {
        throw new Error('Comment not found');
    }
    return comment;
}
