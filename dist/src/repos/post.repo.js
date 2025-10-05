"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostRepo = void 0;
const schema_1 = require("src/services/drizzle/schema");
const Post_1 = require("src/types/Post");
const Comment_1 = require("src/types/Comment");
const drizzle_orm_1 = require("drizzle-orm");
const helpers_1 = require("src/services/drizzle/helpers/helpers");
const PostWithProfile_1 = require("src/types/PostWithProfile");
const Tag_1 = require("src/types/Tag");
const getPostRepo = (db) => {
    return {
        async getPosts(options) {
            const limit = options?.limit || 10;
            const offset = options?.page ? (options.page - 1) * limit : 0;
            const order = options?.sortOrder === 'desc' ? drizzle_orm_1.desc : drizzle_orm_1.asc;
            const searchSql = options?.search
                ? (0, drizzle_orm_1.sql) `
            (
              similarity(${schema_1.postTable.title}, ${options.search}) > 0.3
              OR similarity(${schema_1.postTable.description}, ${options.search}) > 0.3
            )
          `
                : undefined;
            const tagFilter = options?.tagIds && options.tagIds.length > 0
                ? (0, drizzle_orm_1.exists)(db.select()
                    .from(schema_1.tagToPostTable)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tagToPostTable.postId, schema_1.postTable.id), (0, drizzle_orm_1.inArray)(schema_1.tagToPostTable.tagId, options.tagIds))))
                : undefined;
            const activeFilter = (0, drizzle_orm_1.isNull)(schema_1.postTable.deletedAt);
            // Combine conditions using Drizzle functions
            const whereConditions = [searchSql, tagFilter, activeFilter].filter(Boolean);
            const combinedWhere = whereConditions.length > 0
                ? whereConditions.reduce((acc, condition) => acc ? (0, drizzle_orm_1.and)(acc, condition) : condition)
                : undefined;
            // Total count
            const totalResult = await db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(schema_1.postTable)
                .where(combinedWhere);
            const total = totalResult[0]?.count || 0;
            // Posts with comments
            const postsWithCommentsAndProfile = await db
                .select({
                post: schema_1.postTable,
                comments: (0, helpers_1.jsonAggBuildObject)({
                    id: schema_1.commentTable.id,
                    postId: schema_1.commentTable.postId,
                    text: schema_1.commentTable.text,
                    createdAt: schema_1.commentTable.createdAt,
                    updatedAt: schema_1.commentTable.updatedAt,
                    createdBy: schema_1.commentTable.createdBy,
                    deletedAt: schema_1.commentTable.deletedAt
                }),
                profile: (0, helpers_1.jsonAggBuildObject)({
                    id: schema_1.profileTable.id,
                    name: schema_1.profileTable.name,
                    email: schema_1.profileTable.email,
                    dickSize: schema_1.profileTable.dickSize,
                    subId: schema_1.profileTable.subId,
                    createdAt: schema_1.profileTable.createdAt,
                    updatedAt: schema_1.profileTable.updatedAt,
                    systemRole: schema_1.profileTable.systemRole,
                    deletedAt: schema_1.profileTable.deletedAt
                }),
                tags: (0, helpers_1.jsonAggBuildObject)({
                    id: schema_1.tagTable.id,
                    name: schema_1.tagTable.name,
                    createdAt: schema_1.tagTable.createdAt,
                    updatedAt: schema_1.tagTable.updatedAt
                })
            })
                .from(schema_1.postTable)
                .leftJoin(schema_1.commentTable, (0, drizzle_orm_1.eq)(schema_1.postTable.id, schema_1.commentTable.postId))
                .leftJoin(schema_1.profileTable, (0, drizzle_orm_1.eq)(schema_1.postTable.createdBy, schema_1.profileTable.id))
                .leftJoin(schema_1.tagToPostTable, (0, drizzle_orm_1.eq)(schema_1.postTable.id, schema_1.tagToPostTable.postId))
                .leftJoin(schema_1.tagTable, (0, drizzle_orm_1.eq)(schema_1.tagToPostTable.tagId, schema_1.tagTable.id))
                .where(combinedWhere)
                .groupBy(schema_1.postTable.id, schema_1.postTable.title, schema_1.postTable.description, schema_1.postTable.createdAt, schema_1.postTable.updatedAt)
                .having(options?.commentCount !== undefined
                ? (0, drizzle_orm_1.eq)((0, drizzle_orm_1.count)(schema_1.commentTable.id), options.commentCount)
                : undefined)
                .orderBy(order(options?.sortBy === 'title' ? schema_1.postTable.title : options?.sortBy === 'commentCount' ? (0, drizzle_orm_1.count)(schema_1.commentTable.id) : schema_1.postTable.createdAt))
                .limit(limit)
                .offset(offset);
            const posts = postsWithCommentsAndProfile.map(row => {
                const comments = row.comments || [];
                return PostWithProfile_1.PostWithProfileSchema.parse({
                    ...row.post,
                    deletedAt: row.post.deletedAt ? new Date(row.post.deletedAt) : null,
                    createdBy: {
                        ...row.profile[0],
                        createdAt: new Date(row.profile[0].createdAt),
                        updatedAt: new Date(row.profile[0].updatedAt),
                        deletedAt: row.profile[0].deletedAt ? new Date(row.profile[0].deletedAt) : null
                    },
                    commentCount: comments.length,
                    comments: comments.map(comment => Comment_1.CommentSchema.parse({
                        ...comment,
                        createdAt: new Date(comment.createdAt),
                        updatedAt: new Date(comment.updatedAt),
                        deletedAt: comment.deletedAt ? new Date(comment.deletedAt) : null
                    })),
                    tags: row.tags.map(tag => Tag_1.TagSchema.parse({
                        ...tag,
                        createdAt: new Date(tag.createdAt),
                        updatedAt: new Date(tag.updatedAt)
                    }))
                });
            });
            return { posts, total };
        },
        async getPostsByProfileId(profileId) {
            // Posts with comments and profile
            const postsWithCommentsAndProfile = await db
                .select({
                post: schema_1.postTable,
                comments: (0, helpers_1.jsonAggBuildObject)({
                    id: schema_1.commentTable.id,
                    postId: schema_1.commentTable.postId,
                    text: schema_1.commentTable.text,
                    createdAt: schema_1.commentTable.createdAt,
                    updatedAt: schema_1.commentTable.updatedAt,
                    createdBy: schema_1.commentTable.createdBy,
                    deletedAt: schema_1.commentTable.deletedAt
                }),
                profile: (0, helpers_1.jsonAggBuildObject)({
                    id: schema_1.profileTable.id,
                    name: schema_1.profileTable.name,
                    email: schema_1.profileTable.email,
                    dickSize: schema_1.profileTable.dickSize,
                    subId: schema_1.profileTable.subId,
                    createdAt: schema_1.profileTable.createdAt,
                    updatedAt: schema_1.profileTable.updatedAt,
                    systemRole: schema_1.profileTable.systemRole,
                    deletedAt: schema_1.profileTable.deletedAt
                }),
                tags: (0, helpers_1.jsonAggBuildObject)({
                    id: schema_1.tagTable.id,
                    name: schema_1.tagTable.name,
                    createdAt: schema_1.tagTable.createdAt,
                    updatedAt: schema_1.tagTable.updatedAt
                })
            })
                .from(schema_1.postTable)
                .leftJoin(schema_1.commentTable, (0, drizzle_orm_1.eq)(schema_1.postTable.id, schema_1.commentTable.postId))
                .leftJoin(schema_1.profileTable, (0, drizzle_orm_1.eq)(schema_1.postTable.createdBy, schema_1.profileTable.id))
                .leftJoin(schema_1.tagToPostTable, (0, drizzle_orm_1.eq)(schema_1.postTable.id, schema_1.tagToPostTable.postId))
                .leftJoin(schema_1.tagTable, (0, drizzle_orm_1.eq)(schema_1.tagToPostTable.tagId, schema_1.tagTable.id))
                .where((0, drizzle_orm_1.eq)(schema_1.postTable.createdBy, profileId))
                .groupBy(schema_1.postTable.id, schema_1.postTable.title, schema_1.postTable.description, schema_1.postTable.createdAt, schema_1.postTable.updatedAt)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.postTable.createdAt));
            const posts = postsWithCommentsAndProfile.map(row => {
                const comments = row.comments || [];
                return PostWithProfile_1.PostWithProfileSchema.parse({
                    ...row.post,
                    deletedAt: row.post.deletedAt ? new Date(row.post.deletedAt) : null,
                    createdBy: {
                        ...row.profile[0],
                        createdAt: new Date(row.profile[0].createdAt),
                        updatedAt: new Date(row.profile[0].updatedAt),
                        deletedAt: row.profile[0].deletedAt ? new Date(row.profile[0].deletedAt) : null
                    },
                    commentCount: comments.length,
                    comments: comments.map(comment => Comment_1.CommentSchema.parse({
                        ...comment,
                        createdAt: new Date(comment.createdAt),
                        updatedAt: new Date(comment.updatedAt),
                        deletedAt: comment.deletedAt ? new Date(comment.deletedAt) : null
                    })),
                    tags: row.tags.map(tag => Tag_1.TagSchema.parse({
                        ...tag,
                        createdAt: new Date(tag.createdAt),
                        updatedAt: new Date(tag.updatedAt)
                    }))
                });
            });
            return { posts, total: posts.length };
        },
        async createPost(postData, tx) {
            const conn = (tx || db);
            const post = await conn.insert(schema_1.postTable).values(postData).returning();
            return Post_1.PostSchema.parse(post[0]);
        },
        async getPostById(id, tx) {
            const conn = (tx || db);
            const postWithComments = await conn.select({
                id: schema_1.postTable.id,
                title: schema_1.postTable.title,
                description: schema_1.postTable.description,
                createdAt: schema_1.postTable.createdAt,
                updatedAt: schema_1.postTable.updatedAt,
                deletedAt: schema_1.postTable.deletedAt,
                comments: (0, helpers_1.jsonAggBuildObject)({
                    id: schema_1.commentTable.id,
                    postId: schema_1.commentTable.postId,
                    text: schema_1.commentTable.text,
                    createdAt: schema_1.commentTable.createdAt,
                    updatedAt: schema_1.commentTable.updatedAt,
                    deletedAt: schema_1.commentTable.deletedAt
                })
            })
                .from(schema_1.postTable)
                .leftJoin(schema_1.commentTable, (0, drizzle_orm_1.eq)(schema_1.postTable.id, schema_1.commentTable.postId))
                .where((0, drizzle_orm_1.eq)(schema_1.postTable.id, id))
                .groupBy(schema_1.postTable.id, schema_1.postTable.title, schema_1.postTable.description, schema_1.postTable.createdAt, schema_1.postTable.updatedAt);
            if (postWithComments.length === 0) {
                throw new Error('Post not found');
            }
            const row = postWithComments[0];
            const comments = row.comments || [];
            return Post_1.PostSchema.parse({
                id: row.id,
                title: row.title,
                description: row.description,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                deletedAt: row.deletedAt ? new Date(row.deletedAt) : null,
                comments: comments.map(comment => Comment_1.CommentSchema.parse({
                    ...comment,
                    createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
                    updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : new Date(),
                    deletedAt: comment.deletedAt ? new Date(comment.deletedAt) : null
                }))
            });
        },
        async updatePostById(id, postData) {
            const posts = await db
                .update(schema_1.postTable)
                .set(postData)
                .where((0, drizzle_orm_1.eq)(schema_1.postTable.id, id))
                .returning();
            return posts.length > 0 ? Post_1.PostSchema.parse(posts[0]) : null;
        },
        async updateDeletedAt(id, deletedAt, tx) {
            const conn = (tx || db);
            await conn.update(schema_1.postTable).set({ deletedAt }).where((0, drizzle_orm_1.eq)(schema_1.postTable.id, id));
        },
        async hardDeletePost(id, tx) {
            const conn = (tx || db);
            await conn.delete(schema_1.postTable).where((0, drizzle_orm_1.eq)(schema_1.postTable.createdBy, id));
        },
        async getPostsByUserId(userId, tx) {
            const conn = (tx || db);
            const posts = await conn.select().from(schema_1.postTable).where((0, drizzle_orm_1.eq)(schema_1.postTable.createdBy, userId));
            return Post_1.PostSchema.array().parse(posts);
        },
        async getSoftDeletedPosts(tx) {
            const conn = (tx || db);
            const posts = await conn.select().from(schema_1.postTable).where((0, drizzle_orm_1.isNotNull)(schema_1.postTable.deletedAt));
            return Post_1.PostSchema.array().parse(posts);
        }
    };
};
exports.getPostRepo = getPostRepo;
