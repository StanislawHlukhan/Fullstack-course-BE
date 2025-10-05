"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = createComment;
async function createComment(params) {
    const comment = await params.commentRepo.createComment(params.data, params.postId);
    return comment;
}
