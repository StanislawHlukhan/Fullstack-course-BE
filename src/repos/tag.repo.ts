import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tagTable } from 'src/services/drizzle/schema';
import { ITagRepo } from 'src/types/ITagRepo';
import { Tag, TagSchema } from 'src/types/Tag';

export const getTagRepo = (db: NodePgDatabase): ITagRepo => {
  return {
    async getTags(){
      const tags = await db.select().from(tagTable);
      return TagSchema.array().parse(tags);
    },
    async createTag(tag){
      const newTag = await db.insert(tagTable).values(tag as Tag).returning();
      return TagSchema.parse(newTag[0]);
    },
    async updateTagById(id, tag){
      const updatedTag = await db.update(tagTable).set(tag).where(eq(tagTable.id, id)).returning();
      return TagSchema.parse(updatedTag[0]);
    },
    async deleteTagById(id){
      await db.delete(tagTable).where(eq(tagTable.id, id));
    },
    async getTagByName(name){
      const tag = await db.select().from(tagTable).where(eq(tagTable.name, name));
      return TagSchema.array().parse(tag);
    }
  };
};

