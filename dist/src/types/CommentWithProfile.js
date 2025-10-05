"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentWithProfileSchema = void 0;
const Comment_1 = require("./Comment");
const Profile_1 = require("./Profile");
exports.CommentWithProfileSchema = Comment_1.CommentSchema.extend({
    profile: Profile_1.ProfileSchema
});
