"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (!pathname) return null;

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <main className="flex flex-grow">
          <div className="flex-1">
            {status === "loading" ? <>Lagi loading</> : <>{children}</>}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
