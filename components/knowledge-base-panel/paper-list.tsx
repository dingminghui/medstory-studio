"use client";

import type { KnowledgeBasePaperResponse } from "@/lib/knowledge-base-model";

import { KnowledgeBasePaperRow } from "./paper-row";

type KnowledgeBasePaperListProps = {
  isError: boolean;
  isPending: boolean;
  papers: KnowledgeBasePaperResponse[] | undefined;
};

export function KnowledgeBasePaperList({
  isError,
  isPending,
  papers,
}: KnowledgeBasePaperListProps) {
  return (
    <div className="flex w-80 flex-col divide-y divide-border/60 px-5 pb-4">
      {isPending ? <KnowledgeBasePaperSkeletonList /> : null}

      {isError ? <KnowledgeBasePaperError /> : null}

      {papers?.map((paper) => (
        <KnowledgeBasePaperRow key={paper.id} paper={paper} />
      ))}
    </div>
  );
}

function KnowledgeBasePaperSkeletonList() {
  return (
    <>
      <KnowledgeBasePaperPlaceholder />
      <KnowledgeBasePaperPlaceholder />
      <KnowledgeBasePaperPlaceholder />
    </>
  );
}

function KnowledgeBasePaperError() {
  return (
    <div className="px-1 py-6">
      <div className="text-sm font-medium">知识库加载失败</div>
      <div className="mt-1 text-xs leading-5 text-sidebar-foreground/65">
        请稍后重试。
      </div>
    </div>
  );
}

function KnowledgeBasePaperPlaceholder() {
  return (
    <div className="px-1 py-4">
      <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-muted" />
    </div>
  );
}
