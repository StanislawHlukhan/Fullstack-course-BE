"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTagFromPost = removeTagFromPost;
async function removeTagFromPost(params) {
    await params.tagToPostRepo.removeTagsFromPost(params.postId, params.tagIds);
}
