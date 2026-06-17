"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function MainHeader() {
  const { isMobile, state } = useSidebar();
  const showTrigger = isMobile || state === "collapsed";

  return (
    <header className="bg-background/90 sticky top-0 z-10 flex h-14 shrink-0 items-center px-4 backdrop-blur">
      {showTrigger ? <SidebarTrigger className="-ml-1" /> : null}
    </header>
  );
}
