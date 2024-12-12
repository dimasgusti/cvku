"use client"

import * as React from "react"
import {
  Home,
  PieChart,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "#", // Direct link to the home or landing page.
      icon: Home,
      isActive: true, // Make sure it's highlighted or active when viewing the home page.
      items: [] // No items here; it's a simple link now, but can be expanded in the future.
    },
    {
      title: "Explore",
      url: "#", // Link to Explore section or portfolio discovery page.
      icon: PieChart,
    },
    {
      title: "Account",
      url: "#", // Link to account page.
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/profile", // Link to the user's profile page.
        },
        {
          title: "Settings",
          url: "/settings", // Link to account settings page.
        },
        {
          title: "Notifications",
          url: "/notifications", // Link to notification settings.
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: PieChart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* To-do: Add logo here */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* If you have projects or other items, you can include them here */}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* Add user profile or other footer content here */}
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}