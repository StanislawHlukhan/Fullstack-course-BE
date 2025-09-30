import { WebhookEvent } from './WebhookEvent';

export interface IWebhookEventRepo {
  logWebhookEvent(webhookEvent: Partial<WebhookEvent>): Promise<WebhookEvent>;
  markWebhookProcessed(eventId: string): Promise<void>;
  isWebhookProcessed(eventId: string): Promise<boolean>;
}