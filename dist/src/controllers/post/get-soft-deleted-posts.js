"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoftDeletedPosts = getSoftDeletedPosts;
async function getSoftDeletedPosts(params) {
    const posts = await params.postRepo.getSoftDeletedPosts();
    return { posts, total: posts.length };
}
