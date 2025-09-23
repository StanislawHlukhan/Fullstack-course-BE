import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { archiveTable } from 'src/services/drizzle/schema';
import { ArchiveSchema } from 'src/types/Archive';
import { eq } from 'drizzle-orm';
import { IArchiveRepo } from 'src/types/IArchiveRepo';
import { desc } from 'drizzle-orm';

export const getArchiveRepo = (db: NodePgDatabase): IArchiveRepo => {
  return {
    async createArchive(params){
      const conn = (params.tx || db) as NodePgDatabase;
      const rows = await conn.insert(archiveTable).values({
        archivedUserId: params.archivedUserId as string,
        userData: params.userData,
        postsData: params.postsData,
        commentsData: params.commentsData,
        tagsData: params.tagsData
      }).returning();
      return ArchiveSchema.parse(rows[0]);
    },

    async getArchiveForUser(archivedUserId){
      const rows = await db.select().from(archiveTable)
        .where(eq(archiveTable.archivedUserId, archivedUserId))
        .limit(1);
      return rows[0] ? ArchiveSchema.parse(rows[0]) : null;
    },

    async deleteArchive(userId, tx?: unknown) {
      const conn = (tx || db) as NodePgDatabase;
      await conn.delete(archiveTable).where(eq(archiveTable.archivedUserId, userId));
    },

    async getArchivedUsers() {
      const archives = await db.select().from(archiveTable).orderBy(desc(archiveTable.createdAt));
      return ArchiveSchema.array().parse(archives);
    }
  };
};

