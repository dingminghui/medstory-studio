"use client";

import { useState, useRef } from "react";
import { ArrowUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCreateDocument } from "@/hooks/use-create-document";
import { CreateDocumentInputSchema } from "@/lib/document-model";
import { DocumentTextarea } from "./document-textarea";

export function HomeInputCard() {
  const router = useRouter();
  const createDocument = useCreateDocument();
  const [title, setTitle] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const canSubmit = title.trim().length > 0 && !createDocument.isPending;
  const showPlaceholder = !title;

  const handleSubmit = () => {
    const result = CreateDocumentInputSchema.safeParse({ title });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    createDocument.mutate(result.data, {
      onSuccess: (document) => {
        router.push(`/documents/${document.id}`);
      },
    });
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-shadow focus-within:shadow-sm">
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <DocumentTextarea
          value={title}
          showPlaceholder={showPlaceholder}
          canSubmit={canSubmit}
          onChange={setTitle}
          onSubmit={() => {
            if (canSubmit) {
              formRef.current?.requestSubmit();
            }
          }}
        />

        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5">
          <Badge className="cursor-pointer gap-1 text-xs" variant="secondary">
            初始模板
          </Badge>

          <Button
            aria-label="创建文档"
            className="size-8 rounded-full"
            disabled={!canSubmit}
            size="icon"
            type="submit"
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
