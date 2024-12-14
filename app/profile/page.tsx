"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import CreateProjectForm from "./forms/Create-Project-Form";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  company?: string;
  description?: string;
  link?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(
          `/api/projects?userId=${session?.user?.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setUserProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [session]);

  if (status === "loading" || loading) {
    return <h1>Loading...</h1>;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex flex-row justify-center items-center my-4">
      <div className="w-[360px] min-h-96">
        <div className="flex flex-row justify-start items-center gap-4">
          <Image
            src={session.user?.image || "/defaultAvatar.png"}
            width={100}
            height={100}
            alt={session.user?.name || "Guest Avatar"}
            className="rounded-full"
            priority
          />
          <div>
            <p>{session.user?.name}</p>
            <p>{session.user?.email}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col justify-start items-start gap-4">
          <div className="flex flex-row justify-between w-full">
            <p className="text-sm">Projects</p>
            {userProjects.length > 0 ? (
              <CreateProjectForm onProjectAdded={fetchProjects} />
            ) : (
              <></>
            )}
          </div>
          {userProjects.length > 0 ? (
            <ul>
              {userProjects.map((project) => (
                <div key={project.id}>
                  {!project.endDate == null ? (
                    <p className="text-sm">
                      {project.startDate} - {project.endDate}
                    </p>
                  ) : (
                    <p className="text-sm">{project.startDate} - Present</p>
                  )}
                  <p>{project.title}</p>
                </div>
              ))}
            </ul>
          ) : (
            <CreateProjectForm onProjectAdded={fetchProjects} />
          )}
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
  );
}
