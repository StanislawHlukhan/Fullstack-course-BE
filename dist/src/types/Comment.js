"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = void 0;
const zod_1 = require("zod");
exports.CommentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    text: zod_1.z.string(),
    postId: zod_1.z.string().uuid(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    createdBy: zod_1.z.string().uuid(),
    deletedAt: zod_1.z.date().nullable().optional()
});
