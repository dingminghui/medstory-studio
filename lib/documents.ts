import { desc, eq } from "drizzle-orm";

import { documents } from "@/db/schema";
import { getDb } from "@/lib/db";
import {
  normalizeDocumentContent,
  type UpdateDocumentInput,
} from "@/lib/document-model";

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

export async function updateDocumentById(
  id: string,
  input: UpdateDocumentInput,
) {
  const [document] = await getDb()
    .update(documents)
    .set({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined
        ? { content: normalizeDocumentContent(input.content) }
        : {}),
      updatedAt: new Date(),
    })
    .where(eq(documents.id, id))
    .returning();

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
