"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import CreateProjectForm from "./forms/Create-Project-Form";

interface AddProjectFormData {
  title: string;
  startDate: string;
  endDate?: string;
  company?: string;
  description?: string;
  link?: string;
  attachments: string[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();

  console.log(session)

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (session) {
    return (
      <>
        <div className="flex flex-row justify-center items-center my-4">
          <div className="w-[360px] min-h-96">
            <div className="flex flex-row justify-start items-center gap-4">
              <Image
                src={session.user?.image || "defaultAvatar.png"}
                width={100}
                height={100}
                alt={session.user?.name || "Guest Avatar"}
                className="rounded-full"
                priority
              />
              <div>
                <p>{session.user?.name}</p>
                <p>{session.user?.email}</p>
                <p>{session.user?.id}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col justify-start items-start gap-4">
              <CreateProjectForm />
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col justify-start items-start gap-4">
              <Button variant="outline">
                <FaPlus />
                Add Awards
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    redirect("/auth/signin");
  }
}
