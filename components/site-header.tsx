"use client";

import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full">
      <Button
        className="fixed top-2 left-1 z-50 h-10 w-10"
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
      >
        <SidebarIcon />
      </Button>
    </header>
  );
}
