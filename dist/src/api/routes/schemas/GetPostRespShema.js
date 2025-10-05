"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostRespSchema = void 0;
const Comment_1 = require("src/types/Comment");
const Tag_1 = require("src/types/Tag");
const zod_1 = require("zod");
exports.GetPostRespSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    commentCount: zod_1.z.number().optional(),
    comments: zod_1.z.array(Comment_1.CommentSchema).optional(),
    createdBy: zod_1.z.string().uuid(),
    tags: zod_1.z.array(Tag_1.TagSchema).optional(),
    deletedAt: zod_1.z.coerce.date().nullable().optional()
});
