"use client";

import { ArrowLeftIcon } from "lucide-react";

import { useKnowledgeBasePapers } from "@/hooks/use-knowledge-base-papers";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useKnowledgeBasePanel } from "./context";
import { KnowledgeBasePaperDetailSheet } from "./paper-detail-sheet";
import { KnowledgeBasePaperList } from "./paper-list";

export function KnowledgeBasePanelSurface() {
  const { open, previewPaper, selectedPaper, setOpen, setSelectedPaper } =
    useKnowledgeBasePanel();
  const papersQuery = useKnowledgeBasePapers(open);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 bg-sidebar px-4">
        <Button
          aria-label="关闭知识库"
          className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
          onClick={() => {
            setOpen(false);
          }}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <ArrowLeftIcon />
        </Button>
        <div className="min-w-0">
          <div className="text-sm font-medium">知识库</div>
        </div>
      </header>

      <ScrollArea className="min-h-0 flex-1" viewportClassName="h-full">
        <KnowledgeBasePaperList
          isError={papersQuery.isError}
          isPending={papersQuery.isPending}
          onViewPaper={previewPaper}
          papers={papersQuery.data}
        />
      </ScrollArea>

      <KnowledgeBasePaperDetailSheet
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setSelectedPaper(null);
          }
        }}
        open={Boolean(selectedPaper)}
        paper={selectedPaper}
      />
    </>
  );
}
