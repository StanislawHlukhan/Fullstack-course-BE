import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { commentTable } from 'src/services/drizzle/schema';
import { Comment, CommentSchema } from 'src/types/Comment';
import { ICommentRepo } from 'src/types/ICommentRepo';
import { and, eq } from 'drizzle-orm';

export const getCommentRepo = (db: NodePgDatabase): ICommentRepo => {
  return {
    async getCommentsByPostId(postId){
      const comments = await db.select().from(commentTable).where(eq(commentTable.postId, postId));
      return CommentSchema.array().parse(comments);
    },

    async createComment(commentData, postId){
      const comment = await db.insert(commentTable).values({
        ...commentData,
        postId
      } as Comment).returning();
      return CommentSchema.parse(comment[0]);
    },

   async updateCommentByIdAndPostId(id, postId, commentData){
    const comment = await db.update(commentTable).set(commentData)
    .where(and(eq(commentTable.id, id), eq(commentTable.postId, postId))).returning();
    return CommentSchema.parse(comment[0]);
   }
  };
};