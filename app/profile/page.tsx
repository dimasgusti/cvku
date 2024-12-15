"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ProjectForm from "./forms/ProjectForm";

interface Project {
  id: string;
  title: string;
  year: string;
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
        const response = await fetch(`/api/projects/${session.user.id}`);
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
    console.log("Session ID:", session?.user?.id);
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
      <div className="sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 p-4 md:p-0">
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
            <p className="text-sm">{session.user?.name}</p>
            <p className="text-sm">{session.user?.email}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col justify-start items-start gap-4">
          <div className="flex flex-row justify-between w-full">
            <p className="text-sm">Projects</p>
            {userProjects.length > 0 ? (
              <ProjectForm onProjectAdded={fetchProjects} />
            ) : (
              <></>
            )}
          </div>
          {userProjects.length > 0 ? (
            <ul className="flex flex-col gap-4 w-full">
              {userProjects.map((project) => (
                <div key={project.id} className="w-full grid grid-cols-4">
                  <div className="">
                    {project.year == "ongoing" ? (
                      <p className="text-sm">Ongoing</p>
                    ) : (
                      <p className="text-sm">{project.year}</p>
                    )}
                  </div>
                  <div className="col-start-3 col-end-5">
                    <p className="font-bold">{project.title}</p>
                    {project.company ? (
                      <p className="text-sm">at {project.company}</p>
                    ) : (
                      <p className="text-sm"></p>
                    )}
                    <p className="text-sm">{project.description}</p>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <ProjectForm onProjectAdded={fetchProjects} />
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
