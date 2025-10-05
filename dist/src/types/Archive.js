"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveSchema = void 0;
const zod_1 = require("zod");
exports.ArchiveSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    archivedUserId: zod_1.z.string().uuid(),
    userData: zod_1.z.any(),
    postsData: zod_1.z.any(),
    commentsData: zod_1.z.any(),
    tagsData: zod_1.z.any(),
    createdAt: zod_1.z.date()
});
