"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebhookEventRepo = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("src/services/drizzle/schema");
const WebhookEvent_1 = require("src/types/WebhookEvent");
const getWebhookEventRepo = (db) => {
    return {
        async logWebhookEvent(webhookEvent) {
            const result = await db.insert(schema_1.webhookEventTable).values(webhookEvent).returning();
            return WebhookEvent_1.WebhookEventSchema.parse(result[0]);
        },
        async markWebhookProcessed(eventId) {
            return await db.update(schema_1.webhookEventTable)
                .set({ processed: true, processedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_1.webhookEventTable.eventId, eventId));
        },
        async isWebhookProcessed(eventId) {
            const result = await db
                .select()
                .from(schema_1.webhookEventTable)
                .where((0, drizzle_orm_1.eq)(schema_1.webhookEventTable.eventId, eventId))
                .limit(1);
            return result.length ? result[0].processed || false : false;
        }
    };
};
exports.getWebhookEventRepo = getWebhookEventRepo;
