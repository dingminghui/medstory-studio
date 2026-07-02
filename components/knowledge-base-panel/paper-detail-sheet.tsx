"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { KnowledgeBasePaperResponse } from "@/lib/knowledge-base-model";
import { formatDate } from "@/lib/utils/date";

type KnowledgeBasePaperDetailSheetProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  paper: KnowledgeBasePaperResponse | null;
};

export function KnowledgeBasePaperDetailSheet({
  onOpenChange,
  open,
  paper,
}: KnowledgeBasePaperDetailSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full p-0 sm:max-w-xl">
        <DrawerHeader className="border-b px-6 py-5 pr-12">
          <DrawerTitle>{paper?.title ?? "论文详情"}</DrawerTitle>
          <DrawerDescription>
            {paper
              ? `${paper.journal} · ${formatDate(paper.publishDate, "YYYY.MM.DD")}`
              : ""}
          </DrawerDescription>
        </DrawerHeader>

        {paper ? (
          <ScrollArea className="min-h-0 flex-1" viewportClassName="h-full">
            <div className="flex flex-col px-6 py-4">
              <div className="grid gap-1.5">
                <MetadataRow
                  label="期刊"
                  value={<Badge variant="outline">{paper.journal}</Badge>}
                />
                <MetadataRow
                  label="影响因子"
                  value={
                    <Badge variant="secondary">
                      IF {paper.ifValue.toFixed(1)}
                    </Badge>
                  }
                />
                <MetadataRow
                  label="发布日期"
                  value={formatDate(paper.publishDate, "YYYY.MM.DD")}
                />
                <MetadataRow label="作者" value={paper.authors} />
                <MetadataRow label="关键词" value={paper.keywords} />
                <MetadataRow
                  label="DOI"
                  value={
                    <span className="font-mono text-xs break-all">
                      {paper.doi}
                    </span>
                  }
                />
              </div>

              <Separator className="my-6" />

              <DetailSection label="摘要">{paper.abstract}</DetailSection>
            </div>
          </ScrollArea>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

function DetailSection({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{label}</h3>
      <div className="text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}

function MetadataRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm leading-6 text-foreground">{value}</div>
    </div>
  );
}
