"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagRepo = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("src/services/drizzle/schema");
const Tag_1 = require("src/types/Tag");
const getTagRepo = (db) => {
    return {
        async getTags() {
            const tags = await db.select().from(schema_1.tagTable);
            return Tag_1.TagSchema.array().parse(tags);
        },
        async createTag(tag) {
            const newTag = await db.insert(schema_1.tagTable).values(tag).returning();
            return Tag_1.TagSchema.parse(newTag[0]);
        },
        async updateTagById(id, tag) {
            const updatedTag = await db.update(schema_1.tagTable).set(tag).where((0, drizzle_orm_1.eq)(schema_1.tagTable.id, id)).returning();
            return Tag_1.TagSchema.parse(updatedTag[0]);
        },
        async deleteTagById(id) {
            await db.delete(schema_1.tagTable).where((0, drizzle_orm_1.eq)(schema_1.tagTable.id, id));
        },
        async getTagByName(name) {
            const tag = await db.select().from(schema_1.tagTable).where((0, drizzle_orm_1.eq)(schema_1.tagTable.name, name));
            return Tag_1.TagSchema.array().parse(tag);
        }
    };
};
exports.getTagRepo = getTagRepo;
