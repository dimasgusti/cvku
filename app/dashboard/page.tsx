"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectRecord {
  id: string;
  type: string;
  title: string;
  year: string;
  url: string;
  company: string;
  description: string;
}

interface AwardRecord {
    id: string;
    type: string;
    title: string;
    year: string;
    url: string;
    presentedBy: string;
    description: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userProjectRecords, setUserProjectRecords] = useState<ProjectRecord[]>([]);
  const [userAwardRecords, setUserAwardRecords] = useState<AwardRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    if (session?.user?.id) {
      try {
        const projectResponse = await fetch(`/api/projects/${session.user.id}`);
        const awardResponse = await fetch(`/api/awards/${session.user.id}`);
        if (!projectResponse.ok) {
          throw new Error("Failed to fetch projects.");
        }
        if (!awardResponse.ok) {
          throw new Error("Failed to fetch projects.");
        }
        const projectData = await projectResponse.json();
        const awardData = await awardResponse.json();
        setUserProjectRecords(projectData);
        setUserAwardRecords(awardData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [session]);

  if (status === "loading" || loading) {
    return <h1>Loading...</h1>;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex flex-row justify-center items-center py-8">
      <div className="sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96">
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

        <div className="flex flex-row justify-between items-center">
          <p>Projects</p>
          <Link href="/dashboard/add-project">
            <Button variant="outline">Add Project</Button>
          </Link>
        </div>
        {userProjectRecords.length > 0 ? (
          userProjectRecords.map((project) => (
            <div key={project.id} className="grid grid-cols-4 mt-2">
              <div>
                {project.year === 'ongoing' ? (<p>In Development</p>) : (<p>{project.year}</p>)}
              </div>
              <div className="col-start-2 col-end-5">
                <p>
                  {project.title}{" "}
                  <span>
                    {project.url && project.company ? (
                      <>
                        at{" "}
                        <a
                          href={project.url}
                          target="_blank"
                          className="underline"
                        >
                          {project.company}
                        </a>
                      </>
                    ) : project.company ? (
                      <span>at {project.company}</span>
                    ) : project.url ? (
                      <span>
                        <a
                          href={project.url}
                          target="_blank"
                          className="underline"
                        >
                          Visit Link
                        </a>
                      </span>
                    ) : (
                      <></>
                    )}
                  </span>
                </p>
                <p>{project.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}

        <Separator className="my-4" />

        <div className="flex flex-row justify-between items-center">
          <p>Awards</p>
          <Link href="/dashboard/add-award">
            <Button variant="outline">Add Award</Button>
          </Link>
        </div>
        {userAwardRecords.length > 0 ? (
          userAwardRecords.map((project) => (
            <div key={project.id} className="grid grid-cols-4 mt-2">
              <div>
                {project.year === 'ongoing' ? (<p>In Development</p>) : (<p>{project.year}</p>)}
              </div>
              <div className="col-start-2 col-end-5">
                <p>
                  {project.title}{" "}
                  <span>
                    {project.url && project.presentedBy ? (
                      <>
                        at{" "}
                        <a
                          href={project.url}
                          target="_blank"
                          className="underline"
                        >
                          {project.presentedBy}
                        </a>
                      </>
                    ) : project.presentedBy ? (
                      <span>at {project.presentedBy}</span>
                    ) : project.url ? (
                      <span>
                        <a
                          href={project.url}
                          target="_blank"
                          className="underline"
                        >
                          Visit Link
                        </a>
                      </span>
                    ) : (
                      <></>
                    )}
                  </span>
                </p>
                <p>{project.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
}
