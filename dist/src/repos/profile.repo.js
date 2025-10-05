"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileRepo = getProfileRepo;
const schema_1 = require("src/services/drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const Profile_1 = require("src/types/Profile");
const drizzle_orm_2 = require("drizzle-orm");
function getProfileRepo(db) {
    return {
        async getByEmail(email, tx) {
            const conn = (tx || db);
            const profile = await conn.select().from(schema_1.profileTable).where((0, drizzle_orm_1.eq)(schema_1.profileTable.email, email)).limit(1);
            return profile[0] ? Profile_1.ProfileSchema.parse(profile[0]) : null;
        },
        async getProfileBySubId(subId) {
            const profile = await db.select().from(schema_1.profileTable).where((0, drizzle_orm_1.eq)(schema_1.profileTable.subId, subId)).limit(1);
            return profile[0] ? Profile_1.ProfileSchema.parse(profile[0]) : null;
        },
        async createProfile(data, tx) {
            const conn = (tx || db);
            const profile = await conn.insert(schema_1.profileTable).values(data).returning();
            return Profile_1.ProfileSchema.parse(profile[0]);
        },
        async getProfiles(options) {
            const limit = options?.limit || 10;
            const offset = options?.page ? (options.page - 1) * limit : 0;
            let whereClause;
            if (options?.search) {
                whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.isNull)(schema_1.profileTable.deletedAt), (0, drizzle_orm_1.sql) `similarity(${schema_1.profileTable.name}, ${options.search}) > 0.3`);
            }
            else {
                whereClause = (0, drizzle_orm_1.isNull)(schema_1.profileTable.deletedAt);
            }
            // Get total count with search filter
            const totalResult = await db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(schema_1.profileTable)
                .where(whereClause);
            const total = totalResult[0]?.count || 0;
            // Get profiles with search filter, limit, and offset
            const profiles = await db
                .select()
                .from(schema_1.profileTable)
                .where(whereClause)
                .limit(limit)
                .offset(offset);
            return { profiles: Profile_1.ProfileSchema.array().parse(profiles), total };
        },
        async getProfileById(id, tx) {
            const conn = (tx || db);
            const profile = await conn.select().from(schema_1.profileTable).where((0, drizzle_orm_1.eq)(schema_1.profileTable.id, id)).limit(1);
            return profile[0] ? Profile_1.ProfileSchema.parse(profile[0]) : null;
        },
        async updateActivatedAt(id, activatedAt) {
            await db.update(schema_1.profileTable).set({ activatedAt }).where((0, drizzle_orm_1.eq)(schema_1.profileTable.id, id));
        },
        async updateDeletedAt(id, deletedAt, tx) {
            const conn = (tx || db);
            await conn.update(schema_1.profileTable).set({ deletedAt }).where((0, drizzle_orm_1.eq)(schema_1.profileTable.id, id));
        },
        async hardDeleteProfile(id, tx) {
            const conn = (tx || db);
            await conn.delete(schema_1.profileTable).where((0, drizzle_orm_1.eq)(schema_1.profileTable.id, id));
        },
        async getSoftDeletedProfiles() {
            const profiles = await db.select().from(schema_1.profileTable).where((0, drizzle_orm_2.isNotNull)(schema_1.profileTable.deletedAt));
            return Profile_1.ProfileSchema.array().parse(profiles);
        },
        async updateStripeCustomerId(id, stripeCustomerId) {
            await db.update(schema_1.profileTable).set({ stripeCustomerId }).where((0, drizzle_orm_1.eq)(schema_1.profileTable.id, id));
        }
    };
}
