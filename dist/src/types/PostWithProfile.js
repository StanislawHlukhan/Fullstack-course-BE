"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostWithProfileSchema = void 0;
const Post_1 = require("./Post");
const Profile_1 = require("./Profile");
const Tag_1 = require("./Tag");
exports.PostWithProfileSchema = Post_1.PostSchema.extend({
    createdBy: Profile_1.ProfileSchema,
    tags: Tag_1.TagSchema.array().optional()
});
