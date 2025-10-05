"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTags = getTags;
async function getTags(params) {
    const tags = await params.tagRepo.getTags();
    return tags;
}
