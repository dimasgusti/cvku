"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface Profile {
  username: string;
  title: string;
  country: string;
  bio: string;
  email: string;
  image: string;
}

interface Record {
  id: string;
  type: string;
  title: string;
  name: string;
  year: string;
  issued: string;
  expires: string;
  from: string;
  to: string;
  url: string;
  company: string;
  organization: string;
  location: string;
  presentedBy: string;
  description: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Record[]>([]);
  const [awards, setAwards] = useState<Record[]>([]);
  const [certifications, setCertification] = useState<Record[]>([]);
  const [workplaces, setWorkplaces] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(
          `/api/users/getUserByEmail?email=${session.user.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch records.");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [session?.user?.id]);

  const fetchRecords = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(
          `/api/records/getRecordById?userId=${session.user.id}`
        );

        if (!response.ok) {
          let errorMessage = "Failed to fetch records.";

          if (response.status !== 204) {
            const responseText = await response.text();
            if (responseText) {
              try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.error || errorMessage;
              } catch (err) {
                console.error("Error parsing the error response:", err);
              }
            }
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        setProjects(data.filter((record: Record) => record.type === "project"));
        setAwards(data.filter((record: Record) => record.type === "award"));
        setCertification(
          data.filter((record: Record) => record.type === "certification")
        );
        setWorkplaces(
          data.filter((record: Record) => record.type === "workplace")
        );
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchRecords();
    fetchUsers();
  }, [fetchRecords, fetchUsers]);

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
          <div className="flex flex-row justify-between w-full">
            <div>
              <p>{session.user?.name}</p>
              <p>{userData?.username}</p>
              <p>{userData?.title}</p>
              <p>{userData?.country}</p>
              <p>{userData?.bio}</p>
            </div>
            <div>
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm">
                  Profile Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Projects Section */}
        <div className="flex flex-row justify-between items-center">
          <p>Projects</p>
          <Link href="/dashboard/add-project">
            <Button variant="outline" size="sm">
              Add Project
            </Button>
          </Link>
        </div>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="grid grid-cols-4 mt-2">
              <div>
                {project.year === "ongoing" ? (
                  <p>In Development</p>
                ) : (
                  <p>{project.year}</p>
                )}
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

        {/* Awards Section */}
        <div className="flex flex-row justify-between items-center">
          <p>Awards</p>
          <Link href="/dashboard/add-award">
            <Button variant="outline" size="sm">
              Add Award
            </Button>
          </Link>
        </div>
        {awards.length > 0 ? (
          awards.map((award) => (
            <div key={award.id} className="grid grid-cols-4 mt-2">
              <div>
                {award.year === "ongoing" ? (
                  <p>In Development</p>
                ) : (
                  <p>{award.year}</p>
                )}
              </div>
              <div className="col-start-2 col-end-5">
                <p>
                  {award.title}{" "}
                  <span>
                    {award.url && award.presentedBy ? (
                      <>
                        at{" "}
                        <a
                          href={award.url}
                          target="_blank"
                          className="underline"
                        >
                          {award.presentedBy}
                        </a>
                      </>
                    ) : award.presentedBy ? (
                      <span>at {award.presentedBy}</span>
                    ) : award.url ? (
                      <span>
                        <a
                          href={award.url}
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
                <p>{award.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No awards found.</p>
        )}

        <Separator className="my-4" />

        {/* Awards Section */}
        <div className="flex flex-row justify-between items-center">
          <p>Certifications</p>
          <Link href="/dashboard/add-certification">
            <Button variant="outline" size="sm">
              Add Certification
            </Button>
          </Link>
        </div>
        {certifications.length > 0 ? (
          certifications.map((certification) => (
            <div key={certification.id} className="grid grid-cols-4 mt-2">
              <div>
                {certification.issued === "ongoing" ? (
                  <p>In Development</p>
                ) : (
                  <p>{certification.issued}</p>
                )}
              </div>
              <div className="col-start-2 col-end-5">
                <p>
                  {certification.title}{" "}
                  <span>
                    {certification.url && certification.organization ? (
                      <>
                        at{" "}
                        <a
                          href={certification.url}
                          target="_blank"
                          className="underline"
                        >
                          {certification.organization}
                        </a>
                      </>
                    ) : certification.organization ? (
                      <span>at {certification.organization}</span>
                    ) : certification.url ? (
                      <span>
                        <a
                          href={certification.url}
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
                <p>{certification.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No awards found.</p>
        )}

        <Separator className="my-4" />

        {/* Awards Section */}
        <div className="flex flex-row justify-between items-center">
          <p>Workplaces</p>
          <Link href="/dashboard/add-workplace">
            <Button variant="outline" size="sm">
              Add Workplace
            </Button>
          </Link>
        </div>
        {workplaces.length > 0 ? (
          workplaces.map((workplace) => (
            <div key={workplace.id} className="grid grid-cols-4 mt-2">
              <div>
                {workplace.from === "ongoing" ? (
                  <p>Present</p>
                ) : (
                  <p>{workplace.from}</p>
                )}
              </div>
              <div className="col-start-2 col-end-5">
                <p>
                  {workplace.title}{" "}
                  <span>
                    {workplace.url && workplace.company ? (
                      <>
                        at{" "}
                        <a
                          href={workplace.url}
                          target="_blank"
                          className="underline"
                        >
                          {workplace.company}
                        </a>
                      </>
                    ) : workplace.company ? (
                      <span>at {workplace.company}</span>
                    ) : workplace.url ? (
                      <span>
                        <a
                          href={workplace.url}
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
                <p>{workplace.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No awards found.</p>
        )}
      </div>
    </div>
  );
}
