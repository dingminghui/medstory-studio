"use client";

import { useQuery } from "@tanstack/react-query";

import { listKnowledgeBasePapers } from "@/api/knowledge-base";

export const knowledgeBasePapersQueryKey = [
  "knowledge-base",
  "papers",
] as const;

export function useKnowledgeBasePapers(enabled = true) {
  return useQuery({
    enabled,
    queryKey: knowledgeBasePapersQueryKey,
    queryFn: listKnowledgeBasePapers,
  });
}
