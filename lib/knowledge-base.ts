import { asc, desc } from "drizzle-orm";

import { knowledgeBasePapers } from "@/db/schema";
import { getDb } from "@/lib/db";
import type { KnowledgeBasePaperResponse } from "@/lib/knowledge-base-model";

export type KnowledgeBasePaperRecord = typeof knowledgeBasePapers.$inferSelect;

export async function listKnowledgeBasePapers() {
  return getDb()
    .select()
    .from(knowledgeBasePapers)
    .orderBy(
      desc(knowledgeBasePapers.publishDate),
      desc(knowledgeBasePapers.ifValue),
      asc(knowledgeBasePapers.title),
    );
}

export function serializeKnowledgeBasePaper(
  paper: KnowledgeBasePaperRecord,
): KnowledgeBasePaperResponse {
  return {
    id: paper.id,
    title: paper.title,
    journal: paper.journal,
    authors: paper.authors,
    keywords: paper.keywords,
    ifValue: paper.ifValue,
    doi: paper.doi,
    publishDate: String(paper.publishDate),
    abstract: paper.abstract,
  };
}
