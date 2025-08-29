import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { commentTable, postTable, profileTable } from 'src/services/drizzle/schema';
import { IPostRepo } from 'src/types/IPostRepo';
import { Post, PostSchema } from 'src/types/Post';
import { CommentSchema } from 'src/types/Comment';
import { asc, desc, eq, count, sql } from 'drizzle-orm';
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

      // Total count
      const totalResult = await db
        .select({ count: count() })
        .from(postTable)
        .where(searchSql);

      const total = totalResult[0]?.count || 0;

      // Posts with comments
      const postsWithCommentsAndProfile = await db
        .select({
          post: postTable,
          comments: jsonAggBuildObject({
            id: commentTable.id,
            postId: commentTable.postId,
            text: commentTable.text,
            createdAt: commentTable.createdAt,
            updatedAt: commentTable.updatedAt,
            createdBy: commentTable.createdBy
          }),
          profile: jsonAggBuildObject({
            id: profileTable.id,
            name: profileTable.name,
            email: profileTable.email,
            dickSize: profileTable.dickSize,
            subId: profileTable.subId,
            createdAt: profileTable.createdAt,
            updatedAt: profileTable.updatedAt
          }),
          similarityScore: options?.search
            ? sql`GREATEST(
                similarity(${postTable.title}, ${options.search}),
                similarity(${postTable.description}, ${options.search})
              )`
            : sql`0`
        })
        .from(postTable)
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))
        .leftJoin(profileTable, eq(postTable.createdBy, profileTable.id))
        .where(searchSql)
        .groupBy(
          postTable.id,
          postTable.title,
          postTable.description,
          postTable.createdAt,
          postTable.updatedAt
        )
        .having(
          options?.commentCount !== undefined
            ? eq(count(commentTable.id), options.commentCount)
            : undefined
        )
        .orderBy(order(options?.sortBy === 'title' ? postTable.title : options?.sortBy === 'commentCount' ? count(commentTable.id) : postTable.createdAt))
        .limit(limit)
        .offset(offset);

      const posts = postsWithCommentsAndProfile.map(row => {
        const comments = row.comments || [];
        return PostWithProfileSchema.parse({
          ...row.post,
          createdBy:{
            ...row.profile[0],
            createdAt: new Date(row.profile[0].createdAt!),
            updatedAt: new Date(row.profile[0].updatedAt!)
          },
          commentCount: comments.length,
          comments: comments.map(comment =>
            CommentSchema.parse({
              ...comment,
              createdAt: new Date(comment.createdAt!),
              updatedAt: new Date(comment.updatedAt!)
            })
          )
        });
      });

      return { posts, total };
    },

    async createPost(postData){
      const post = await db.insert(postTable).values(postData as Post).returning();
      return PostSchema.parse(post[0]);
    },

    async getPostById(id){
      const postWithComments = await db.select({
        id: postTable.id,
        title: postTable.title,
        description: postTable.description,
        createdAt: postTable.createdAt,
        updatedAt: postTable.updatedAt,
        comments: jsonAggBuildObject({
          id: commentTable.id,
          postId: commentTable.postId,
          text: commentTable.text,
          createdAt: commentTable.createdAt,
          updatedAt: commentTable.updatedAt
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
        comments: comments.map(comment => CommentSchema.parse({
          ...comment,
          createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
          updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : new Date()
        }))
      });
    },

    async updatePostById(id, postData){
      const posts = await db
      .update(postTable)
      .set(postData)
      .where(eq(postTable.id, id))
      .returning();
      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    }
  };
};