import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { commentTable } from 'src/services/drizzle/schema';
import { Comment, CommentSchema } from 'src/types/Comment';
import { ICommentRepo } from 'src/types/ICommentRepo';
import { and, eq, inArray } from 'drizzle-orm';

export const getCommentRepo = (db: NodePgDatabase): ICommentRepo => {
  return {
    async getCommentsByPostId(postId){
      const comments = await db.select().from(commentTable).where(eq(commentTable.postId, postId));
      return CommentSchema.array().parse(comments);
    },

    async createComment(commentData, postId, tx?: unknown){
      const conn = (tx || db) as NodePgDatabase;
      const comment = await conn.insert(commentTable).values({
        ...commentData,
        postId
      } as Comment).returning();
      return CommentSchema.parse(comment[0]);
    },

   async updateCommentByIdAndPostId(id, postId, commentData){
    const comment = await db.update(commentTable).set(commentData)
    .where(and(eq(commentTable.id, id), eq(commentTable.postId, postId))).returning();
    return CommentSchema.parse(comment[0]);
   },

   async updateDeletedAt(id, deletedAt, tx?: unknown){
    const conn = (tx || db) as NodePgDatabase;
    await conn.update(commentTable).set({ deletedAt }).where(eq(commentTable.postId, id));
   },

   async hardDeleteComment(userId, tx?: unknown){
    const conn = (tx || db) as NodePgDatabase;
    await conn.delete(commentTable).where(eq(commentTable.createdBy, userId));
   },

   async hardDeleteCommentsByPostIds(postIds, tx?: unknown) {
    const conn = (tx || db) as NodePgDatabase;
    if (postIds.length === 0) {
      return;
    }
    await conn.delete(commentTable).where(inArray(commentTable.postId, postIds));
   },

   async getCommentsByUserId(userId, tx?: unknown) {
    const conn = (tx || db) as NodePgDatabase;
    const comments = await conn.select().from(commentTable).where(eq(commentTable.createdBy, userId));
    return CommentSchema.array().parse(comments);
   },

   async getCommentsByPostIds(postIds, tx?: unknown) {
    const conn = (tx || db) as NodePgDatabase;
    if (postIds.length === 0) {
      return [];
    }
    const comments = await conn.select().from(commentTable).where(inArray(commentTable.postId, postIds));
    return CommentSchema.array().parse(comments);
   }
  };
};