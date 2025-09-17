import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { archiveTable, commentTable, postTable, profileTable, tagTable, tagToPostTable } from 'src/services/drizzle/schema';
import { ArchiveSchema } from 'src/types/Archive';
import { eq, inArray } from 'drizzle-orm';
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

    async archiveAndHardDeleteUser(userId) {
      await db.transaction(async (tx) => {
        const userRows = await tx.select().from(profileTable).where(eq(profileTable.id, userId)).limit(1);
        const user = userRows[0];
        if (!user) {
          throw new Error('User not found');
        }

        const posts = await tx.select().from(postTable).where(eq(postTable.createdBy, userId));
        const postIds = posts.map(p => p.id);

        const tagsData = postIds.length > 0
          ? await tx.select({
              postId: tagToPostTable.postId,
              id: tagTable.id,
              name: tagTable.name,
              createdAt: tagTable.createdAt,
              updatedAt: tagTable.updatedAt
            })
            .from(tagToPostTable)
            .leftJoin(tagTable, eq(tagToPostTable.tagId, tagTable.id))
            .where(inArray(tagToPostTable.postId, postIds))
          : [];

        const commentsByUser = await tx.select().from(commentTable).where(eq(commentTable.createdBy, userId));
        const commentsUnderUserPosts = postIds.length > 0
          ? await tx.select().from(commentTable).where(inArray(commentTable.postId, postIds))
          : [];

        // Ensure only one archive per user
        await tx.delete(archiveTable).where(eq(archiveTable.archivedUserId, userId));

        await this.createArchive({
          archivedUserId: userId,
          userData: user,
          postsData: posts,
          commentsData: [...commentsByUser, ...commentsUnderUserPosts],
          tagsData,
          tx
        });

        if (postIds.length > 0) {
          await tx.delete(tagToPostTable).where(inArray(tagToPostTable.postId, postIds));
          await tx.delete(commentTable).where(inArray(commentTable.postId, postIds));
        }
        await tx.delete(commentTable).where(eq(commentTable.createdBy, userId));
        await tx.delete(postTable).where(eq(postTable.createdBy, userId));
        await tx.delete(profileTable).where(eq(profileTable.id, userId));
      });
    },

    async restoreUserFromArchive(userId) {
      await db.transaction(async (tx) => {
        const archive = await this.getArchiveForUser(userId);
        if (!archive) {
          throw new Error('Archive not found for user');
        }

        const userData = archive.userData as any;
        const postsData = (archive.postsData as any[]) || [];
        const commentsData = (archive.commentsData as any[]) || [];
        const tagsData = (archive.tagsData as any[]) || [];

        const activatedAtRaw = (userData.activatedAt ?? null);
        const [newProfile] = await tx.insert(profileTable).values({
          name: userData.name,
          email: userData.email,
          dickSize: userData.dickSize,
          subId: userData.subId,
          systemRole: userData.systemRole,
          activatedAt: activatedAtRaw ? new Date(activatedAtRaw) : null,
          deletedAt: null
        }).returning();

        const oldToNewPostId: Record<string, string> = {};

        if (postsData.length > 0) {
          for (const p of postsData) {
            const [newPost] = await tx.insert(postTable).values({
              title: p.title,
              description: p.description,
              createdBy: newProfile.id
            }).returning();
            oldToNewPostId[p.id] = newPost.id;
          }
        }

        if (commentsData.length > 0) {
          for (const c of commentsData) {
            const newPostId = oldToNewPostId[c.postId];
            if (!newPostId) { continue; }
            const createdBy = c.createdBy === userId ? newProfile.id : c.createdBy;
            await tx.insert(commentTable).values({
              text: c.text,
              postId: newPostId,
              createdBy
            });
          }
        }

        if (tagsData.length > 0) {
          for (const t of tagsData as any[]) {
            const newPostId = oldToNewPostId[t.postId];
            if (!newPostId) { continue; }
            await tx.insert(tagToPostTable).values({
              postId: newPostId,
              tagId: t.id
            });
          }
        }

        await tx.delete(archiveTable).where(eq(archiveTable.archivedUserId, userId));
      });
    },

    async getArchivedUsers() {
      const archives = await db.select().from(archiveTable).orderBy(desc(archiveTable.createdAt));
      return ArchiveSchema.array().parse(archives);
    }
  };
};

