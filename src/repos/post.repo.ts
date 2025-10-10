import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { commentTable, postTable, profileTable, tagTable, tagToPostTable } from 'src/services/drizzle/schema';
import { IPostRepo } from 'src/types/IPostRepo';
import { Post, PostSchema } from 'src/types/Post';
import { asc, desc, eq, count, sql, inArray, exists, and, isNull, isNotNull, getTableColumns } from 'drizzle-orm';
import { jsonAggBuildObject } from 'src/services/drizzle/helpers/helpers';
import { PostWithProfileSchema } from 'src/types/PostWithProfile';

export const getPostRepo = (db: NodePgDatabase): IPostRepo => {
  return{
    async getPosts(options) {
      const limit = options?.limit || 10;
      const offset = options?.page ? (options.page - 1) * limit : 0;
      const order = options?.sortOrder === 'desc' ? desc : asc;

      const searchSql = options?.search
        ? sql`
            (
              similarity(${postTable.title}, ${options.search}) > 0.3
              OR similarity(${postTable.description}, ${options.search}) > 0.3
            )
          `
        : undefined;

      const tagFilter = options?.tagIds && options.tagIds.length > 0
        ? exists(
            db.select()
              .from(tagToPostTable)
              .where(
                and(
                  eq(tagToPostTable.postId, postTable.id),
                  inArray(tagToPostTable.tagId, options.tagIds)
                )
              )
          )
        : undefined;
      
      const activeFilter = isNull(postTable.deletedAt);
      
      // Combine conditions using Drizzle functions
      const whereConditions = [searchSql, tagFilter, activeFilter].filter(Boolean);
      const combinedWhere = whereConditions.length > 0 
        ? whereConditions.reduce((acc, condition) => 
            acc ? and(acc, condition) : condition
          )
        : undefined;

      // Total count
      const totalResult = await db
        .select({ count: count() })
        .from(postTable)
        .where(combinedWhere);

      const total = totalResult[0]?.count || 0;

      // Posts with comments
      const postsWithCommentsAndProfile = await db
        .select({
          post: postTable,
          comments: jsonAggBuildObject(getTableColumns(commentTable)),
          profile: getTableColumns(profileTable),
          tags: jsonAggBuildObject(getTableColumns(tagTable))
        })
        .from(postTable)
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .leftJoin(profileTable, eq(postTable.createdBy, profileTable.id))
        .leftJoin(tagToPostTable, eq(postTable.id, tagToPostTable.postId))
        .leftJoin(tagTable, eq(tagToPostTable.tagId, tagTable.id))
        .where(combinedWhere)
        .groupBy(
          postTable.id,
          profileTable.id
        )
        .having(
          options?.commentCount !== undefined
            ? eq(count(commentTable.id), options.commentCount)
            : undefined
        )
        .orderBy(order(options?.sortBy === 'title' ? postTable.title : options?.sortBy === 'commentCount' ? count(commentTable.id) : postTable.createdAt))
        .limit(limit)
        .offset(offset);
        
    // Оптимізований мапінг: парсимо всі дані разом замість кожного рядка окремо
    // z.coerce автоматично перетворює дати, тому не потрібно робити new Date() вручну
    const posts = postsWithCommentsAndProfile.map(row => {
      const comments = row.comments || [];
      return PostWithProfileSchema.parse({
        ...row.post,
        createdBy: row.profile,
        commentCount: comments.length,
        comments,
        tags: row.tags
      });
    });

      return { posts, total };
    },

    async getPostsByProfileId(profileId) {
      // Posts with comments and profile
      const postsWithCommentsAndProfile = await db
        .select({
          post: postTable,
          comments: jsonAggBuildObject({
            id: commentTable.id,
            postId: commentTable.postId,
            text: commentTable.text,
            createdAt: commentTable.createdAt,
            updatedAt: commentTable.updatedAt,
            createdBy: commentTable.createdBy,
            deletedAt: commentTable.deletedAt
          }),
          profile: jsonAggBuildObject({
            id: profileTable.id,
            name: profileTable.name,
            email: profileTable.email,
            footSize: profileTable.footSize,
            subId: profileTable.subId,
            createdAt: profileTable.createdAt,
            updatedAt: profileTable.updatedAt,
            systemRole: profileTable.systemRole,
            deletedAt: profileTable.deletedAt
          }),
          tags: jsonAggBuildObject({
            id: tagTable.id,
            name: tagTable.name,
            createdAt: tagTable.createdAt,
            updatedAt: tagTable.updatedAt
          })
        })
        .from(postTable)
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .leftJoin(profileTable, eq(postTable.createdBy, profileTable.id))
        .leftJoin(tagToPostTable, eq(postTable.id, tagToPostTable.postId))
        .leftJoin(tagTable, eq(tagToPostTable.tagId, tagTable.id))
        .where(eq(postTable.createdBy, profileId))
        .groupBy(
          postTable.id,
          profileTable.id
        )
        .orderBy(desc(postTable.createdAt));

      const posts = postsWithCommentsAndProfile.map(row => {
        const comments = row.comments || [];
        return PostWithProfileSchema.parse({
          ...row.post,
          createdBy: row.profile[0],
          commentCount: comments.length,
          comments,
          tags: row.tags
        });
      });

      return { posts, total: posts.length };
    },

    async createPost(postData, tx?: unknown){
      const conn = (tx || db) as NodePgDatabase;
      const post = await conn.insert(postTable).values(postData as Post).returning();
      return PostSchema.parse(post[0]);
    },

    async createPosts(postsData, tx?: unknown){
      const conn = (tx || db) as NodePgDatabase;
      if (postsData.length === 0) {
        return [];
      }
      const posts = await conn.insert(postTable).values(postsData as Post[]).returning();
      return PostSchema.array().parse(posts);
    },

    async getPostById(id, tx?: unknown){
      const conn = (tx || db) as NodePgDatabase;
      const postWithComments = await conn.select({
        id: postTable.id,
        title: postTable.title,
        description: postTable.description,
        createdAt: postTable.createdAt,
        updatedAt: postTable.updatedAt,
        deletedAt: postTable.deletedAt,
        createdBy: postTable.createdBy,
        comments: jsonAggBuildObject({
          id: commentTable.id,
          postId: commentTable.postId,
          text: commentTable.text,
          createdAt: commentTable.createdAt,
          updatedAt: commentTable.updatedAt,
          deletedAt: commentTable.deletedAt
        })
      })
      .from(postTable)
      .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
      .where(eq(postTable.id, id))
      .groupBy(postTable.id, postTable.title, postTable.description, postTable.createdAt, postTable.updatedAt);

      if (postWithComments.length === 0) {
        throw new Error('Post not found');
      }

      const row = postWithComments[0];
      const comments = row.comments || [];
      
      return PostSchema.parse({
        id: row.id,
        title: row.title,
        description: row.description,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdBy: row.createdBy,
        comments
      });
    },

    async updatePostById(id, postData){
      const posts = await db
      .update(postTable)
      .set(postData)
      .where(eq(postTable.id, id))
      .returning();
      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    },

    async updateDeletedAt(id, deletedAt, tx?: unknown){
      const conn = (tx || db) as NodePgDatabase;
      await conn.update(postTable).set({ deletedAt }).where(eq(postTable.id, id));
    },

    async hardDeletePost(id, tx?: unknown){
      const conn = (tx || db) as NodePgDatabase;
      await conn.delete(postTable).where(eq(postTable.createdBy, id));
    },

    async getPostsByUserId(userId, tx?: unknown) {
      const conn = (tx || db) as NodePgDatabase;
      const posts = await conn.select().from(postTable).where(eq(postTable.createdBy, userId));
      return PostSchema.array().parse(posts);
    },

    async getSoftDeletedPosts(tx?: unknown) {
      const conn = (tx || db) as NodePgDatabase;
      const posts = await conn.select().from(postTable).where(isNotNull(postTable.deletedAt));
      return PostSchema.array().parse(posts);
    }
  };
};