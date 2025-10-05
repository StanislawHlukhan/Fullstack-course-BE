"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArchiveRepo = void 0;
const schema_1 = require("src/services/drizzle/schema");
const Archive_1 = require("src/types/Archive");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_orm_2 = require("drizzle-orm");
const getArchiveRepo = (db) => {
    return {
        async createArchive(params) {
            const conn = (params.tx || db);
            const rows = await conn.insert(schema_1.archiveTable).values({
                archivedUserId: params.archivedUserId,
                userData: params.userData,
                postsData: params.postsData,
                commentsData: params.commentsData,
                tagsData: params.tagsData
            }).returning();
            return Archive_1.ArchiveSchema.parse(rows[0]);
        },
        async getArchiveForUser(archivedUserId) {
            const rows = await db.select().from(schema_1.archiveTable)
                .where((0, drizzle_orm_1.eq)(schema_1.archiveTable.archivedUserId, archivedUserId))
                .limit(1);
            return rows[0] ? Archive_1.ArchiveSchema.parse(rows[0]) : null;
        },
        async deleteArchive(userId, tx) {
            const conn = (tx || db);
            await conn.delete(schema_1.archiveTable).where((0, drizzle_orm_1.eq)(schema_1.archiveTable.archivedUserId, userId));
        },
        async getArchivedUsers() {
            const archives = await db.select().from(schema_1.archiveTable).orderBy((0, drizzle_orm_2.desc)(schema_1.archiveTable.createdAt));
            return Archive_1.ArchiveSchema.array().parse(archives);
        }
    };
};
exports.getArchiveRepo = getArchiveRepo;
