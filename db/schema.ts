import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

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
