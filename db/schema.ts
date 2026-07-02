import {
  date,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import type { DocumentContent } from "@/lib/document-model";

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: jsonb("content").$type<DocumentContent>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const knowledgeBasePapers = pgTable("knowledge_base_papers", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  journal: text("journal").notNull(),
  authors: text("authors").notNull(),
  keywords: text("keywords").notNull(),
  ifValue: real("if_value").notNull(),
  doi: text("doi").notNull().unique(),
  publishDate: date("publish_date").notNull(),
  abstract: text("abstract").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
