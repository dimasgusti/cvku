'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession } from 'next-auth/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if(status === "loading") return null;

  if(status === "unauthenticated"){
    router.push('/auth/signin');
    return null;
  }

  if (!pathname) return null;

  const pathnames = pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathnames.map((pathname, index) => {
    const href = "/" + pathnames.slice(0, index + 1).join("/");
    return (
      <BreadcrumbItem key={href}>
        {index < pathnames.length - 1 ? (
          <BreadcrumbLink href={href}>{capitalizeFirstLetter(pathname)}</BreadcrumbLink>
        ) : (
          <BreadcrumbPage>{capitalizeFirstLetter(pathname)}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {breadcrumbItems}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex p-4">
          <div className="flex-1">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}