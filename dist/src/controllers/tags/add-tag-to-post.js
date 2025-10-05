"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTagToPost = addTagToPost;
async function addTagToPost(params) {
    const existingTags = await params.tagToPostRepo.getTagsByPostId(params.postId);
    const newTagIds = params.tagIds.filter(tagId => !existingTags.some(tag => tag.id === tagId));
    if (newTagIds.length > 0) {
        await params.tagToPostRepo.addTagsToPost(params.postId, newTagIds);
    }
}
