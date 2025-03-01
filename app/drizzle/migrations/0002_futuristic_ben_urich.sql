CREATE TABLE "link_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(255) NOT NULL,
	"link_code" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "link_codes_link_code_unique" UNIQUE("link_code")
);
--> statement-breakpoint
ALTER TABLE "profile" RENAME COLUMN "forigner" TO "foreigner";--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "discordId" text;