"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { MainHeader } from "@/components/main-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDocument } from "@/hooks/use-create-document";
import {
  CreateDocumentInputSchema,
  MAX_DOCUMENT_TITLE_LENGTH,
} from "@/lib/document-model";

export default function HomePage() {
  const router = useRouter();
  const createDocument = useCreateDocument();
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState("");

  const hasError = Boolean(validationError);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const result = CreateDocumentInputSchema.safeParse({ title });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "标题无效");
      return;
    }

    setValidationError("");
    createDocument.mutate(result.data, {
      onSuccess: (document) => {
        router.push(`/documents/${document.id}`);
      },
    });
  };

  return (
    <>
      <MainHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <section className="w-full max-w-3xl">
          <Card className="rounded-2xl py-0 shadow-xs">
            <CardContent className="p-3 md:p-4">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <Label className="sr-only" htmlFor="document-title">
                    文章标题
                  </Label>
                  <div className="bg-background focus-within:border-ring focus-within:ring-ring/50 flex items-center gap-2 rounded-xl border px-2 py-2 shadow-xs transition-colors focus-within:ring-3">
                    <Input
                      id="document-title"
                      aria-invalid={hasError}
                      className="h-14 border-0 px-3 text-lg shadow-none focus-visible:ring-0 md:text-xl"
                      maxLength={MAX_DOCUMENT_TITLE_LENGTH}
                      placeholder="输入文章标题或写作需求"
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        if (validationError) {
                          setValidationError("");
                        }
                      }}
                    />
                    <Button
                      aria-label="创建文档"
                      className="size-11 rounded-xl"
                      disabled={createDocument.isPending}
                      size="icon-lg"
                      type="submit"
                    >
                      <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                  </div>
                  {validationError ? (
                    <p className="text-destructive px-1 text-sm">
                      {validationError}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 px-1">
                  <Badge variant="secondary">初始模板</Badge>
                  <Badge className="opacity-60" variant="outline">
                    AI 根据标题生成内容 · 暂不可用
                  </Badge>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
