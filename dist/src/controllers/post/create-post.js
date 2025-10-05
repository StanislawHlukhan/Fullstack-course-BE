"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
async function createPost(params) {
    const post = await params.postRepo.createPost(params.data);
    return post;
}
