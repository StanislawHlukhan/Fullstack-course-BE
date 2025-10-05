"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagToPostRepo = void 0;
const schema_1 = require("src/services/drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const Tag_1 = require("src/types/Tag");
const getTagToPostRepo = (db) => {
    return {
        async addTagsToPost(postId, tagIds, tx) {
            const conn = (tx || db);
            const postTags = tagIds.map(tagId => ({ postId, tagId }));
            await conn.insert(schema_1.tagToPostTable).values(postTags);
        },
        async removeTagsFromPost(postId, tagIds) {
            await db.delete(schema_1.tagToPostTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tagToPostTable.postId, postId), (0, drizzle_orm_1.inArray)(schema_1.tagToPostTable.tagId, tagIds)));
        },
        async getTagsByPostId(postId) {
            const tags = await db.select({
                id: schema_1.tagToPostTable.tagId,
                name: schema_1.tagTable.name,
                createdAt: schema_1.tagToPostTable.createdAt,
                updatedAt: schema_1.tagToPostTable.updatedAt
            })
                .from(schema_1.tagToPostTable)
                .leftJoin(schema_1.tagTable, (0, drizzle_orm_1.eq)(schema_1.tagToPostTable.tagId, schema_1.tagTable.id))
                .where((0, drizzle_orm_1.eq)(schema_1.tagToPostTable.postId, postId));
            return Tag_1.TagSchema.array().parse(tags);
        },
        async removeTagFromAllPosts(tagId) {
            await db.delete(schema_1.tagToPostTable)
                .where((0, drizzle_orm_1.eq)(schema_1.tagToPostTable.tagId, tagId));
        },
        async getTagsByPostIds(postIds, tx) {
            const conn = (tx || db);
            if (postIds.length === 0) {
                return [];
            }
            const tags = await conn.select({
                postId: schema_1.tagToPostTable.postId,
                id: schema_1.tagTable.id,
                name: schema_1.tagTable.name,
                createdAt: schema_1.tagTable.createdAt,
                updatedAt: schema_1.tagTable.updatedAt
            })
                .from(schema_1.tagToPostTable)
                .leftJoin(schema_1.tagTable, (0, drizzle_orm_1.eq)(schema_1.tagToPostTable.tagId, schema_1.tagTable.id))
                .where((0, drizzle_orm_1.inArray)(schema_1.tagToPostTable.postId, postIds));
            return tags;
        },
        async deleteTagsByPostIds(postIds, tx) {
            const conn = (tx || db);
            if (postIds.length === 0) {
                return;
            }
            await conn.delete(schema_1.tagToPostTable).where((0, drizzle_orm_1.inArray)(schema_1.tagToPostTable.postId, postIds));
        }
    };
};
exports.getTagToPostRepo = getTagToPostRepo;
