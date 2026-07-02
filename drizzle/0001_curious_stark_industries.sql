CREATE TABLE "knowledge_base_papers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"journal" text NOT NULL,
	"authors" text NOT NULL,
	"keywords" text NOT NULL,
	"if_value" real NOT NULL,
	"doi" text NOT NULL,
	"publish_date" date NOT NULL,
	"abstract" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "knowledge_base_papers_doi_unique" UNIQUE("doi")
);
