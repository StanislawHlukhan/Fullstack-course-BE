"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTag = updateTag;
async function updateTag(params) {
    const tag = await params.tagRepo.updateTagById(params.id, params.data);
    if (!tag) {
        throw new Error('Post not found');
    }
    return tag;
}
