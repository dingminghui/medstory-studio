"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createDocument } from "@/api/documents";
import { documentHistoryQueryKey } from "@/hooks/use-document-history";

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["documents", "create"],
    mutationFn: createDocument,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: documentHistoryQueryKey });
    },
    onError: () => {
      toast.error("创建文档失败，请稍后重试");
    },
  });
}
