import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { webhookEventTable } from 'src/services/drizzle/schema';
import { IWebhookEventRepo } from 'src/types/IWebhookEventRepo';
import { WebhookEventSchema } from 'src/types/WebhookEvent';

export const getWebhookEventRepo = (db: NodePgDatabase): IWebhookEventRepo => {
  return {
    async logWebhookEvent(webhookEvent) {
      const result = await db.insert(webhookEventTable).values(webhookEvent).returning();
      return WebhookEventSchema.parse(result[0]);
    },
    async markWebhookProcessed(eventId) {
      return await db.update(webhookEventTable)
      .set({ processed: true, processedAt: new Date() })
      .where(eq(webhookEventTable.eventId, eventId));
    },
    async isWebhookProcessed(eventId) {
      const result = await db
      .select()
      .from(webhookEventTable)
      .where(eq(webhookEventTable.eventId, eventId))
      .limit(1);
  
      return result.length ? result[0].processed || false : false;
    }
  };
};