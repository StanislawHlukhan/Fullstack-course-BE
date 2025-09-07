import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IProfileRepo } from 'src/types/IProfileRepo';
import { profileTable } from 'src/services/drizzle/schema';
import { count, eq, sql } from 'drizzle-orm';
import { Profile, ProfileSchema } from 'src/types/Profile';

export function getProfileRepo(db: NodePgDatabase): IProfileRepo {
  return {

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

      let whereClause = undefined;
      
      if (options?.search) {
        whereClause = sql`
          (
            ${profileTable.name} ILIKE ${`%${options.search}%`}
            OR ${profileTable.email} ILIKE ${`%${options.search}%`}
            OR similarity(${profileTable.name}, ${options.search}) > 0.3
          )
        `;
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
    }
  };
}