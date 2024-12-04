"use client";

import Loading from "@/components/ui/loading";
import OverviewCard from "./components/overview-card";
import { useSession } from "next-auth/react";
import Text from "@/components/ui/text";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userAvatar = session?.user?.image;

  if (!session) {
    return <Loading />;
  } else {
    return (
      <div className="">
        <div className="w-full h-[10rem] flex flex-row justify-between items-center gap-4 px-2">
          <div className="flex flex-row items-center gap-4 p-2">
            <Image
              src={userAvatar || "defaultAvatar.png"}
              width={100}
              height={100}
              alt={session.user?.name || ""}
              className="object-contain"
            />
            <div>
              <Text variant="body">Welcome back, {session?.user?.name}!</Text>
              <Text variant="small">{session?.user?.email}</Text>
              <Link href="#" className="hover:cursor-pointer">
                <Text variant="small" className="text-black/50 decoration-[#99AABB] hover:underline">Update Profile</Text>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full h-[10rem] flex flex-row justify-evenly items-center border-t border-b">
          <div className="w-full h-full flex flex-col justify-center items-center bg-white hover:bg-zinc-50 border-r">
            <Text variant="body">Today Views</Text>
            <Text variant="heading3">531</Text>
            <Text variant="body" className="text-green-500 font-bold">
              +30%
            </Text>
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center bg-white hover:bg-zinc-50">
            <Text variant="body">Total Views</Text>
            <Text variant="heading3">1,135</Text>
            <Text variant="body" className="text-red-500 font-bold">
              -70%
            </Text>
          </div>
        </div>
      </div>
    );
  }
}
