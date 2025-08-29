import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IProfileRepo } from 'src/types/IProfileRepo';
import { profileTable } from 'src/services/drizzle/schema';
import { eq } from 'drizzle-orm';
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
    }
  };
}