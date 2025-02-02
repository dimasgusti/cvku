"use client";

import * as React from "react";
import { Home, Layers, LifeBuoy, Send, User } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Profile, ResponseData } from "@/lib/interfaces";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const { data: userData } = useSWR<Profile>(
    session?.user?.email
      ? `/api/users/getUser?email=${session.user.email}`
      : null,
    fetcher
  );

  const { data: subscriptionData } = useSWR<ResponseData>(
    session?.user?.email
      ? `/api/transaction/getTransactionByEmail?email=${session.user.email}`
      : null,
    fetcher
  );

  const data = {
    user: {
      name: userData?.username || "",
      email: session?.user?.email || "",
      avatar: userData?.image || "",
      proPlan: subscriptionData?.isSubscriptionValidToday ?? false,
    },
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "Templates",
        url: "/templates",
        icon: Layers,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "/feedback",
        icon: Send,
      },
    ],
  };

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
