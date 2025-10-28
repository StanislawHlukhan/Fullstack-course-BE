import { z } from 'zod';

export const WebhookEventSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  eventType: z.string(),
  data: z.any(),
  processed: z.boolean(),
  processedAt: z.date().nullable(),
  createdAt: z.date()
});

export type WebhookEvent = z.infer<typeof WebhookEventSchema>;