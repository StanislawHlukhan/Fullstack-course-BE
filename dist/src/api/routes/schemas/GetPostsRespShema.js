"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsRespSchema = void 0;
const Profile_1 = require("src/types/Profile");
const zod_1 = require("zod");
exports.GetPostsRespSchema = zod_1.z.object({
    posts: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
        commentCount: zod_1.z.number().optional(),
        comments: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string().uuid(),
            text: zod_1.z.string(),
            postId: zod_1.z.string().uuid(),
            createdAt: zod_1.z.date(),
            updatedAt: zod_1.z.date(),
            createdBy: zod_1.z.string().uuid(),
            deletedAt: zod_1.z.date().nullable().optional()
        })).optional(),
        tags: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string().uuid(),
            name: zod_1.z.string(),
            createdAt: zod_1.z.date(),
            updatedAt: zod_1.z.date()
        })).optional(),
        deletedAt: zod_1.z.coerce.date().nullable().optional(),
        createdBy: zod_1.z.object({
            id: zod_1.z.string().uuid(),
            name: zod_1.z.string(),
            email: zod_1.z.string(),
            dickSize: zod_1.z.number(),
            createdAt: zod_1.z.date(),
            updatedAt: zod_1.z.date(),
            subId: zod_1.z.string(),
            systemRole: zod_1.z.nativeEnum(Profile_1.ESystemRole),
            activatedAt: zod_1.z.date().nullable().optional(),
            deletedAt: zod_1.z.date().nullable().optional()
        })
    })),
    total: zod_1.z.number()
});
