"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FaDeleteLeft,
  FaGear,
  FaPlus,
} from "react-icons/fa6";

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

// TO-DO: Add education, skill, publication, volunteer, conferences, references

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
        setLoading(true);
        const response = await fetch(
          `/api/users/getUserByEmail?email=${session.user.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [session?.user?.id]);

  const fetchRecords = useCallback(async () => {
    if (session?.user?.id) {
      try {
        setLoading(true);
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

  const handleRemove = async (recordId: string, recordType: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/records/deleteRecord?recordId=${recordId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete record.");
      }

      if (recordType === "project") {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== recordId)
        );
      } else if (recordType === "award") {
        setAwards((prevAwards) =>
          prevAwards.filter((award) => award.id !== recordId)
        );
      } else if (recordType === "certification") {
        setCertification((prevCertifications) =>
          prevCertifications.filter((cert) => cert.id !== recordId)
        );
      } else if (recordType === "workplace") {
        setWorkplaces((prevWorkplaces) =>
          prevWorkplaces.filter((workplace) => workplace.id !== recordId)
        );
      }

      fetchRecords();
    } catch (error) {
      console.error("Error removing record:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUsers();
      fetchRecords();
    }
  }, [session, fetchUsers, fetchRecords]);

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
            <div className="pr-8">
              {!userData?.username ? (
                <p>
                  {session.user?.name}
                  <br />
                  <span>
                    {userData?.title} from {userData?.country}
                  </span>
                </p>
              ) : (
                <p>
                  {userData.username}
                  <br />
                  <span>
                    {userData?.title} from {userData?.country}
                  </span>
                </p>
              )}
            </div>
            <div>
              <Link href="/dashboard/profile">
                <Button variant="outline">
                  <FaGear />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Experience Section */}
        <div className="flex flex-row justify-between items-center">
          <p>Experience</p>
          <Link href="/dashboard/add-workplace">
            <FaPlus size={14} />
          </Link>
        </div>
        {workplaces.length > 0 ? (
          workplaces.map((workplace) => (
            <div key={workplace.id} className="grid grid-cols-4 mt-2">
              <div>
                <p>
                  {workplace.from === "ongoing" ? (
                    <span>Ongoing</span>
                  ) : (
                    <span>{workplace.from}</span>
                  )}
                  {workplace.to && (
                    <span>
                      {" "}
                      - {workplace.to === "ongoing" ? "Ongoing" : workplace.to}
                    </span>
                  )}
                </p>
              </div>
              <div className="col-start-2 col-end-5">
                <div className="flex flex-row justify-between">
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
                        <a
                          href={workplace.url}
                          target="_blank"
                          className="underline"
                        >
                          Visit Link
                        </a>
                      ) : null}

                      {workplace.location && (
                        <>
                          {" "}
                          - <span>{workplace.location}</span>
                        </>
                      )}
                    </span>
                  </p>

                  <Dialog>
                    <DialogTrigger>
                      <FaDeleteLeft size={14} color="red" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your workplace from our records.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleRemove(workplace.id, "workplace")
                          }
                          className="bg-red-500 text-white"
                        >
                          Remove
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p>{workplace.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No experience found.</p>
        )}

        <Separator className="my-4" />

        {/* Projects Section */}
        <div className="flex flex-row justify-between items-center">
          <p>Portfolio</p>
          <Link href="/dashboard/add-project">
            <FaPlus size={14} />
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
                <div className="flex flex-row justify-between">
                  <p className="flex flex-row items-center gap-2">
                    {project.title}{" "}
                    <span>
                      {project.company && project.url ? (
                        <>
                          at{" "}
                          <a href={project.url} className="underline">
                            {project.company}
                          </a>
                        </>
                      ) : project.company ? (
                        <>at {project.company}</>
                      ) : project.url ? (
                        <>
                          <a href={project.url} className="underline">
                            Visit Link
                          </a>
                        </>
                      ) : null}
                    </span>
                  </p>
                  <Dialog>
                    <DialogTrigger>
                      <FaDeleteLeft size={14} color="red" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your project from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => handleRemove(project.id, "project")}
                          className="bg-red-500 text-white"
                        >
                          Remove
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
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
          <p>Achievements</p>
          <Link href="/dashboard/add-award">
            <FaPlus size={14} />
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
                <div className="flex flex-row justify-between">
                  <p>
                    {award.title}{" "}
                    <span>
                      {award.url && award.presentedBy ? (
                        <>
                          awarded by{" "}
                          <a
                            href={award.url}
                            target="_blank"
                            className="underline"
                          >
                            {award.presentedBy}
                          </a>
                        </>
                      ) : award.presentedBy ? (
                        <span>awarded by {award.presentedBy}</span>
                      ) : award.url ? (
                        <a
                          href={award.url}
                          target="_blank"
                          className="underline"
                        >
                          Visit Link
                        </a>
                      ) : null}
                    </span>
                  </p>
                  <Dialog>
                    <DialogTrigger>
                      <FaDeleteLeft size={14} color="red" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your award from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => handleRemove(award.id, "award")}
                          className="bg-red-500 text-white"
                        >
                          Remove
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p>{award.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No awards found.</p>
        )}

        <Separator className="my-4" />

        {/* Certifications Section */}
        <div className="flex flex-row justify-between items-center">
          <p>Certifications</p>
          <Link href="/dashboard/add-certification">
            <FaPlus size={14} />
          </Link>
        </div>
        {certifications.length > 0 ? (
          certifications.map((certification) => (
            <div key={certification.id} className="grid grid-cols-4 mt-2">
              <div>
                <p>
                  {certification.issued === "ongoing" ? (
                    <span>Ongoing</span>
                  ) : (
                    <span>{certification.issued}</span>
                  )}
                  {certification.expires && (
                    <span>
                      {" "}
                      -{" "}
                      {certification.expires === "doesNotExpire"
                        ? "Indefinate"
                        : certification.expires}
                    </span>
                  )}
                </p>
              </div>
              <div className="col-start-2 col-end-5">
                <div className="flex flex-row justify-between">
                  <p>
                    {certification.title}{" "}
                    <span>
                      {certification.url && certification.organization ? (
                        <>
                          certified by{" "}
                          <a
                            href={certification.url}
                            target="_blank"
                            className="underline"
                          >
                            {certification.organization}
                          </a>
                        </>
                      ) : certification.organization ? (
                        <span>certified by {certification.organization}</span>
                      ) : certification.url ? (
                        <a
                          href={certification.url}
                          target="_blank"
                          className="underline"
                        >
                          Visit Link
                        </a>
                      ) : null}
                    </span>
                  </p>
                  <Dialog>
                    <DialogTrigger>
                      <FaDeleteLeft size={14} color="red" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your project from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleRemove(certification.id, "certification")
                          }
                          className="bg-red-500 text-white"
                        >
                          Remove
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p>{certification.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No awards found.</p>
        )}

        <Separator className="my-4" />
      </div>
    </div>
  );
}
