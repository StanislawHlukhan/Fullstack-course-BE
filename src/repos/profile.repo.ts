import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IProfileRepo } from 'src/types/IProfileRepo';
import { profileTable } from 'src/services/drizzle/schema';
import { and, count, eq, isNull, sql } from 'drizzle-orm';
import { Profile, ProfileSchema } from 'src/types/Profile';
import { isNotNull } from 'drizzle-orm';

export function getProfileRepo(db: NodePgDatabase): IProfileRepo {
  return {

    async getByEmail(email, tx?: unknown) {
      const conn = (tx || db) as NodePgDatabase;
      const profile = await conn.select().from(profileTable).where(eq(profileTable.email, email)).limit(1);
      return profile[0] ? ProfileSchema.parse(profile[0]) : null;
    },

    async getProfileBySubId(subId) {
      const profile = await db.select().from(profileTable).where(eq(profileTable.subId, subId)).limit(1);
      return profile[0] ? ProfileSchema.parse(profile[0]) : null;
    },

    async createProfile(data, tx?: unknown) {
      const conn = (tx || db) as NodePgDatabase;
      const profile = await conn.insert(profileTable).values(data as Profile).returning();
      return ProfileSchema.parse(profile[0]);
    },

    async getProfiles(options) {
      const limit = options?.limit || 10;
      const offset = options?.page ? (options.page - 1) * limit : 0;

      let whereClause;
      
      if (options?.search) {
        whereClause = and(isNull(profileTable.deletedAt), sql`similarity(${profileTable.name}, ${options.search}) > 0.3`);
      } else {
        whereClause = isNull(profileTable.deletedAt);
      }

      // Get total count with search filter
      const totalResult = await db
        .select({ count: count() })
        .from(profileTable)
        .where(whereClause);

      const total = totalResult[0]?.count || 0;

      // Get profiles with search filter, limit, and offset
      const profiles = await db
        .select()
        .from(profileTable)
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      return { profiles: ProfileSchema.array().parse(profiles), total };
    },

    async getProfileById(id, tx?: unknown) {
      const conn = (tx || db) as NodePgDatabase;
      const profile = await conn.select().from(profileTable).where(eq(profileTable.id, id)).limit(1);
      return profile[0] ? ProfileSchema.parse(profile[0]) : null;
    },

    async updateActivatedAt(id, activatedAt) {
      await db.update(profileTable).set({ activatedAt }).where(eq(profileTable.id, id));
    },

    async updateDeletedAt(id, deletedAt, tx?: unknown) {
      const conn = (tx || db) as NodePgDatabase;
      await conn.update(profileTable).set({ deletedAt }).where(eq(profileTable.id, id));
    },

    async hardDeleteProfile(id, tx?: unknown) {
      const conn = (tx || db) as NodePgDatabase;
      await conn.delete(profileTable).where(eq(profileTable.id, id));
    },

    async getSoftDeletedProfiles() {
      const profiles = await db.select().from(profileTable).where(isNotNull(profileTable.deletedAt));
      return ProfileSchema.array().parse(profiles);
    }
  };
}