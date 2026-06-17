CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
