"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsByProfileId = getPostsByProfileId;
async function getPostsByProfileId(params) {
    const res = await params.postRepo.getPostsByProfileId(params.profileId);
    return res;
}
