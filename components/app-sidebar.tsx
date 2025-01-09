"use client";

import * as React from "react";
import {
  Home,
  LifeBuoy,
  MessageCircleQuestion,
  Send,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Explore",
          url: "/explore",
        },
        {
          title: "Templates",
          url: "/templates",
        },
        {
          title: "Pricing",
          url: "/pricing",
        },
      ],
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
    {
      title: "About Us",
      url: "/about-us",
      icon: MessageCircleQuestion
    }
  ],
  navSecondary: [
    {
      title: "Help",
      url: "/help",
      icon: LifeBuoy,
    },
    {
      title: "Privacy and Policy",
      url: "/legal",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <SessionProvider>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/" className="flex flex-row gap-2 items-center">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Image 
                      src="CVKU_LOGO.svg"
                      alt="CVKU.id"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate">CVKU.id</span>
                    <span className="truncate text-xs">Cool</span>
                  </div>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
      </Sidebar>
    </SessionProvider>
  );
}
