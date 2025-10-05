"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentRepo = void 0;
const schema_1 = require("src/services/drizzle/schema");
const Comment_1 = require("src/types/Comment");
const drizzle_orm_1 = require("drizzle-orm");
const getCommentRepo = (db) => {
    return {
        async getCommentsByPostId(postId) {
            const comments = await db.select().from(schema_1.commentTable).where((0, drizzle_orm_1.eq)(schema_1.commentTable.postId, postId));
            return Comment_1.CommentSchema.array().parse(comments);
        },
        async createComment(commentData, postId, tx) {
            const conn = (tx || db);
            const comment = await conn.insert(schema_1.commentTable).values({
                ...commentData,
                postId
            }).returning();
            return Comment_1.CommentSchema.parse(comment[0]);
        },
        async updateCommentByIdAndPostId(id, postId, commentData) {
            const comment = await db.update(schema_1.commentTable).set(commentData)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.commentTable.id, id), (0, drizzle_orm_1.eq)(schema_1.commentTable.postId, postId))).returning();
            return Comment_1.CommentSchema.parse(comment[0]);
        },
        async updateDeletedAt(id, deletedAt, tx) {
            const conn = (tx || db);
            await conn.update(schema_1.commentTable).set({ deletedAt }).where((0, drizzle_orm_1.eq)(schema_1.commentTable.postId, id));
        },
        async hardDeleteComment(userId, tx) {
            const conn = (tx || db);
            await conn.delete(schema_1.commentTable).where((0, drizzle_orm_1.eq)(schema_1.commentTable.createdBy, userId));
        },
        async hardDeleteCommentsByPostIds(postIds, tx) {
            const conn = (tx || db);
            if (postIds.length === 0) {
                return;
            }
            await conn.delete(schema_1.commentTable).where((0, drizzle_orm_1.inArray)(schema_1.commentTable.postId, postIds));
        },
        async getCommentsByUserId(userId, tx) {
            const conn = (tx || db);
            const comments = await conn.select().from(schema_1.commentTable).where((0, drizzle_orm_1.eq)(schema_1.commentTable.createdBy, userId));
            return Comment_1.CommentSchema.array().parse(comments);
        },
        async getCommentsByPostIds(postIds, tx) {
            const conn = (tx || db);
            if (postIds.length === 0) {
                return [];
            }
            const comments = await conn.select().from(schema_1.commentTable).where((0, drizzle_orm_1.inArray)(schema_1.commentTable.postId, postIds));
            return Comment_1.CommentSchema.array().parse(comments);
        }
    };
};
exports.getCommentRepo = getCommentRepo;
