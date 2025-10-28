ALTER TABLE "webhook_events" ADD COLUMN "data" jsonb;--> statement-breakpoint
ALTER TABLE "webhook_events" DROP COLUMN "payload";