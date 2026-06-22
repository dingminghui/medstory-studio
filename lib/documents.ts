import { desc, eq } from "drizzle-orm";

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

export async function listDocumentHistory() {
  return getDb()
    .select({
      id: documents.id,
      title: documents.title,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .orderBy(desc(documents.updatedAt))
    .limit(30);
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

export function serializeDocumentHistoryItem(
  document: Awaited<ReturnType<typeof listDocumentHistory>>[number],
) {
  return {
    id: document.id,
    title: document.title,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
