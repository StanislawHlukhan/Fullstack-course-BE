import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tagTable, tagToPostTable } from 'src/services/drizzle/schema';
import { eq, inArray, and } from 'drizzle-orm';
import { ITagToPostRepo } from 'src/types/ITagToPostRepo';
import { TagSchema } from 'src/types/Tag';

export const getTagToPostRepo = (db: NodePgDatabase): ITagToPostRepo => {
  return{
    async addTagsToPost(postId: string, tagIds: string[]) {
      const postTags = tagIds.map(tagId => ({ postId, tagId }));
      await db.insert(tagToPostTable).values(postTags);
    },

    async removeTagsFromPost(postId: string, tagIds: string[]) {
      await db.delete(tagToPostTable)
        .where(
          and(
            eq(tagToPostTable.postId, postId),
            inArray(tagToPostTable.tagId, tagIds)
          )
        );
    },

    async getTagsByPostId(postId: string) {
      const tags = await db.select({
        id: tagToPostTable.tagId,
        name: tagTable.name,
        createdAt: tagToPostTable.createdAt,
        updatedAt: tagToPostTable.updatedAt
      })
      .from(tagToPostTable)
      .leftJoin(tagTable, eq(tagToPostTable.tagId, tagTable.id))
      .where(eq(tagToPostTable.postId, postId));
      
      return TagSchema.array().parse(tags);
    },

    async removeTagFromAllPosts(tagId: string) {
      await db.delete(tagToPostTable)
        .where(eq(tagToPostTable.tagId, tagId));
    }
  };
};