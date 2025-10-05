"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHardDeletedRespSchema = exports.UserWithPostsSchema = exports.PostWithTagsAndCommentsSchema = exports.TagLinkSchema = void 0;
const zod_1 = require("zod");
const GetUserRespSchema_1 = require("./GetUserRespSchema");
const Post_1 = require("src/types/Post");
const Comment_1 = require("src/types/Comment");
const Tag_1 = require("src/types/Tag");
exports.TagLinkSchema = zod_1.z.object({
    postId: zod_1.z.string().uuid(),
    tagId: zod_1.z.string().uuid()
});
exports.PostWithTagsAndCommentsSchema = Post_1.PostSchema.extend({
    tags: Tag_1.TagSchema.array().optional(),
    comments: Comment_1.CommentSchema.array().optional()
});
exports.UserWithPostsSchema = GetUserRespSchema_1.GetUserRespSchema.extend({
    posts: exports.PostWithTagsAndCommentsSchema.array().optional()
});
exports.GetHardDeletedRespSchema = zod_1.z.object({
    users: exports.UserWithPostsSchema.array(),
    total: zod_1.z.number()
});
