"use client";

import { KnowledgeBasePanelProvider } from "@/components/knowledge-base-panel";
import { LeftSidebarStack } from "@/components/left-sidebar-stack";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <KnowledgeBasePanelProvider>
        <LeftSidebarStack />
        <SidebarInset>{children}</SidebarInset>
      </KnowledgeBasePanelProvider>
    </SidebarProvider>
  );
}
