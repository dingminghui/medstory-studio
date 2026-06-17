"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { createDocument } from "@/api/documents";

export function useCreateDocument() {
  return useMutation({
    mutationKey: ["documents", "create"],
    mutationFn: createDocument,
    onError: () => {
      toast.error("创建文档失败，请稍后重试");
    },
  });
}
