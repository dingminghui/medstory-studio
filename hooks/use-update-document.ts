"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateDocument } from "@/api/documents";
import { documentHistoryQueryKey } from "@/hooks/use-document-history";
import type { UpdateDocumentRequest } from "@/api/documents/typings";

export function useUpdateDocument(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["documents", id, "update"],
    mutationFn: (input: UpdateDocumentRequest) => updateDocument(id, input),
    scope: {
      id: `document:${id}:update`,
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentHistoryQueryKey });
    },
    onError: () => {
      toast.error("保存失败，请稍后重试");
    },
  });
}
