"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
async function getPosts(params) {
    const res = await params.postRepo.getPosts(params.options);
    return { posts: res.posts, total: res.total };
}
