"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <QueryProvider>{children}</QueryProvider>
      <Toaster position="top-center" richColors />
    </TooltipProvider>
  );
}
