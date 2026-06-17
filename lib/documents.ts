import { eq } from "drizzle-orm";

import { documents } from "@/db/schema";
import { getDb } from "@/lib/db";

export type DocumentRecord = typeof documents.$inferSelect;

export async function getDocumentById(id: string) {
  const [document] = await getDb()
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);

  return document ?? null;
}

export function serializeDocument(document: DocumentRecord) {
  return {
    id: document.id,
    title: document.title,
    content: document.content,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
