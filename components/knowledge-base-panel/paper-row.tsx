"use client";

import {
  CalendarDaysIcon,
  EyeIcon,
  LibraryBigIcon,
  PlusIcon,
} from "lucide-react";

import type { KnowledgeBasePaperResponse } from "@/lib/knowledge-base-model";
import { formatDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function KnowledgeBasePaperRow({
  onView,
  paper,
}: {
  onView: () => void;
  paper: KnowledgeBasePaperResponse;
}) {
  return (
    <article className="-mx-1 px-1 py-4 transition-colors hover:bg-sidebar-accent/35">
      <div className="line-clamp-2 text-sm leading-6 font-medium">
        {paper.title}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-sidebar-foreground/65">
        <div className="flex items-center gap-2">
          <LibraryBigIcon className="size-3.5" />
          <span className="flex-1 truncate">{paper.journal}</span>
        </div>
        <Separator className="h-3" orientation="vertical" />
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="size-3.5" />
          <span className="text-nowrap">{formatDate(paper.publishDate)}</span>
        </div>
        <Separator className="h-3" orientation="vertical" />
        <span className="text-nowrap">IF {paper.ifValue.toFixed(1)}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button size="xs" type="button" variant="outline">
          <PlusIcon data-icon="inline-start" />
          添加
        </Button>
        <Button onClick={onView} size="xs" type="button" variant="ghost">
          <EyeIcon data-icon="inline-start" />
          查看
        </Button>
      </div>
    </article>
  );
}
