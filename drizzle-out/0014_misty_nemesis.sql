ALTER TABLE "archives" DROP CONSTRAINT "archives_archived_by_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "archives" DROP COLUMN "archived_by";