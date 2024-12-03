import { signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Analytics", url: "/dashboard/analytics" },
      ],
    },
    {
      title: "Portfolio Management",
      url: "#",
      items: [{ title: "View Portfolio", url: "/my-portfolio" }],
    },
    {
      title: "CV Management",
      url: "#",
      items: [{ title: "View CV", url: "/my-cv" }],
    },
    {
      title: "Account Settings",
      url: "#",
      items: [
        { title: "Profile", url: "/profile" },
        { title: "Security Settings", url: "/settings/security" },
        { title: "Notification Settings", url: "/settings/notifications" },
      ],
    },
    {
      title: "Help & Support",
      url: "#",
      items: [
        { title: "FAQ", url: "/help/faq" },
        { title: "Contact Support", url: "/help/contact" },
      ],
    },
  ],
};

export function AppSidebar({
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="sidebar-logo p-2">
          <h2>cvku.id</h2> {/* Replace with your logo */}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <div className="sidebar-footer p-2 mt-auto">
        <Button onClick={() => signOut({ callbackUrl: '/' })} className="w-full">
          Sign Out
        </Button>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}