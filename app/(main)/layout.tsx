"use client";

import { PlateController } from "platejs/react";

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
      <PlateController>
        <KnowledgeBasePanelProvider>
          <LeftSidebarStack />
          <SidebarInset>{children}</SidebarInset>
        </KnowledgeBasePanelProvider>
      </PlateController>
    </SidebarProvider>
  );
}
