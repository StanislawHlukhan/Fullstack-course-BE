"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostById = updatePostById;
async function updatePostById(params) {
    const post = await params.postRepo.updatePostById(params.postId, params.data);
    if (!post) {
        throw new Error('Post not found');
    }
    return post;
}
