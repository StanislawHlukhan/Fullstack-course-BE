"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = deleteTag;
async function deleteTag(params) {
    await params.tagToPostRepo.removeTagFromAllPosts(params.id);
    await params.tagRepo.deleteTagById(params.id);
    return { success: true };
}
