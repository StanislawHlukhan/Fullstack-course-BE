"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownershipHook = void 0;
const HttpError_1 = require("../errors/HttpError");
const ownershipHook = async function (request) {
    try {
        const { postId, commentId } = request.params;
        const currentUserId = request.profile?.id;
        if (!currentUserId) {
            throw new Error('User not authenticated');
        }
        if (postId) {
            const post = await this.repos.postRepo.getPostById(postId);
            if (post.createdBy !== currentUserId) {
                throw new Error('You are not the owner of this post');
            }
        }
        if (commentId) {
            const comments = await this.repos.commentRepo.getCommentsByPostId(postId);
            const comment = comments.find(c => c.id === commentId);
            if (!comment) {
                throw new Error('Comment not found');
            }
            if (comment.createdBy !== currentUserId) {
                throw new Error('You are not the owner of this comment');
            }
        }
    }
    catch (err) {
        throw new HttpError_1.HttpError(403, 'Forbidden', err);
    }
};
exports.ownershipHook = ownershipHook;
