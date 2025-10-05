"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTag = createTag;
async function createTag(params) {
    const tag = await params.tagRepo.getTagByName(params.data.name);
    if (tag.length > 0) {
        throw new Error('Tag already exists');
    }
    const newTag = await params.tagRepo.createTag(params.data);
    return newTag;
}
