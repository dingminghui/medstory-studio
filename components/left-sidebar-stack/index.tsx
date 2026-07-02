"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  KnowledgeBasePanel,
  useKnowledgeBasePanel,
} from "@/components/knowledge-base-panel";
import { cn } from "@/lib/utils";

export function LeftSidebarStack() {
  const { open } = useKnowledgeBasePanel();

  return (
    <div
      className={cn(
        "relative w-(--sidebar-width) shrink-0 transition-[width] duration-200 ease-linear",
        open && "w-80",
      )}
    >
      <AppSidebar />
      <KnowledgeBasePanel />
      <div className="pointer-events-none absolute top-0 right-0 hidden h-svh w-px bg-border md:block" />
    </div>
  );
}
