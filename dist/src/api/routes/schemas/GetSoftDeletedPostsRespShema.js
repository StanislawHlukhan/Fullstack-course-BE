"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSoftDeletedPostsRespSchema = void 0;
const zod_1 = require("zod");
exports.GetSoftDeletedPostsRespSchema = zod_1.z.object({
    posts: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
        createdBy: zod_1.z.string().uuid(),
        deletedAt: zod_1.z.coerce.date().nullable().optional()
    })),
    total: zod_1.z.number()
});
