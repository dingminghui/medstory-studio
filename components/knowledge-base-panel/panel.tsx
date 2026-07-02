"use client";

import { cn } from "@/lib/utils";

import { useKnowledgeBasePanel } from "./context";
import { KnowledgeBasePanelSurface } from "./surface";

export function KnowledgeBasePanel() {
  const { open } = useKnowledgeBasePanel();

  return (
    <div
      className={cn(
        "sticky top-0 left-0 z-20 hidden h-svh w-80 overflow-hidden bg-sidebar text-sidebar-foreground transition-[transform,opacity] duration-200 ease-linear md:block",
        open
          ? "translate-x-0 opacity-100"
          : "translate-x-[calc(var(--sidebar-width)-20rem)] opacity-0",
        !open && "pointer-events-none",
      )}
    >
      <div className="flex h-svh w-80 flex-col">
        <KnowledgeBasePanelSurface />
      </div>
    </div>
  );
}
