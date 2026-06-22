"use client";

import { useQuery } from "@tanstack/react-query";

import { listDocuments } from "@/api/documents";

export const documentHistoryQueryKey = ["documents", "history"] as const;

export function useDocumentHistory() {
  return useQuery({
    queryKey: documentHistoryQueryKey,
    queryFn: listDocuments,
  });
}
