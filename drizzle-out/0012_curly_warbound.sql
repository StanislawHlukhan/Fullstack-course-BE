CREATE TABLE "archives" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"archived_user_id" uuid NOT NULL,
	"archived_at" timestamp DEFAULT now(),
	"archived_by" uuid,
	"user_data" jsonb,
	"posts_data" jsonb,
	"comments_data" jsonb,
	"tags_data" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "archives" ADD CONSTRAINT "archives_archived_by_profiles_id_fk" FOREIGN KEY ("archived_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;