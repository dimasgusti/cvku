"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/utils/api";
import { Loader, PlusCircle, Settings, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

export default function Profile() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<Profile | null>(null);
  const [recordData, setRecordData] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const projects = recordData.filter((record) => record.type === "project");
  const workplace = recordData.filter((record) => record.type === "workplace");

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return "";
    return String.fromCodePoint(
      ...[...countryCode.toUpperCase()].map(
        (c) => 0x1f1e6 - 65 + c.charCodeAt(0)
      )
    );
  };

  const handleRemove = async (recordId: string) => {
    try {
      setBtnLoading(true);
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

      setRecordData((prevData) =>
        prevData.filter((record) => record.id !== recordId)
      );
    } catch (error) {
      console.error("Error removing record:", error);
    } finally {
      toast("Delete success");
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        redirect('/auth/signin')
      }
      try {
        const userData = await fetchData(
          `/api/users/getUserByEmail?email=${session?.user?.email}`
        );
        const recordData = await fetchData(
          `/api/records/getRecordById?userId=${session?.user?.id}`
        );
        setUserData(userData);
        setRecordData(recordData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user?.email) fetchAllData();
  }, [session?.user?.email]);

  if(loading){
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full wsm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
        <div className="flex flex-row justify-start items-center gap-4 py-4">
          <Image
            src={session?.user?.image || "/defaultAvatar.png"}
            width={100}
            height={100}
            alt={session?.user?.name || "Guest"}
            className="rounded-full"
            priority
          />
          <div className="flex flex-row justify-between w-full">
            <div className="pr-4">
              {!userData?.username ? null : (
                <p>
                  {userData?.username} <br />
                  <span>
                    {userData?.title} from {getFlagEmoji(userData?.country)}
                  </span>
                </p>
              )}
            </div>
            <div>
              {!userData?.username ? (
                <>
                  <Link href="/profile/settings">
                    <Button>Set Up Profile</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile/settings">
                    <Button variant="outline">
                      <Settings />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        {userData?.bio ? (
          <>
            <div className="pb-4">
              <p>About</p>
              <p>{userData?.bio}</p>
            </div>
          </>
        ) : null}
        <Separator />
        <>
          <div className="flex flex-row justify-between items-center my-4">
            <p>Project</p>
            <Link href="/profile/project">
              <PlusCircle size={14} />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div>
              {projects.map((record) => (
                <div key={record.id} className="grid grid-cols-4 mt-2">
                  <div>
                    {record.year && (
                      <p>
                        {record.year === "ongoing" ? "Ongoing" : record.year}
                      </p>
                    )}
                  </div>
                  <div className="col-start-2 col-end-5">
                    <div className="flex flex-row justify-between">
                      <p>
                        {record.title}
                        {record.company && record.url ? (
                          <>
                            {" "}
                            at{" "}
                            <a
                              href={record.url}
                              target="_blank"
                              className="underline"
                            >
                              {record.company}
                            </a>
                          </>
                        ) : record.company ? (
                          <> at {record.company}</>
                        ) : record.url ? (
                          <>
                            <a
                              href={record.url}
                              target="_blank"
                              className="underline"
                            >
                              Visit Link
                            </a>
                          </>
                        ) : null}
                      </p>
                      <Dialog>
                        <DialogTrigger>
                          <Trash2 size={14} color="red" />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-thin">
                              Are you sure?
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your project from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              className="bg-red-500 text-white"
                              onClick={() => handleRemove(record.id)}
                              disabled={btnLoading}
                            >
                              {btnLoading ? (
                                <span className="flex flex-row items-center justify-center gap-2">
                                  <Loader className="animate-spin" />
                                  Removing...
                                </span>
                              ) : (
                                <span>Remove</span>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p>{record.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Link href="/profile/project">
              <Button variant="outline" size="sm">
                Add Project
              </Button>
            </Link>
          )}

          <Separator className="my-4" />

          <div className="flex flex-row justify-between items-center my-4">
            <p>Work Experience</p>
            <Link href="/profile/work-experience">
              <PlusCircle size={14} />
            </Link>
          </div>

          {workplace.length > 0 ? (
            <div>
              {workplace.map((record) => (
                <div key={record.id} className="grid grid-cols-4 mt-2">
                  <p>
                    {record.from === "ongoing" ? (
                      <span>Ongoing</span>
                    ) : (
                      <span>{record.from}</span>
                    )}
                    {record.to && (
                      <span>
                        - {record.to === "ongoing" ? "Ongoing" : record.to}
                      </span>
                    )}
                  </p>
                  <div className="col-start-2 col-end-5">
                    <div className="flex flex-row justify-between">
                      <p>
                        {record.title}
                        {record.company && record.url ? (
                          <>
                            {" "}
                            at{" "}
                            <a
                              href={record.url}
                              target="_blank"
                              className="underline"
                            >
                              {record.company}
                            </a>
                          </>
                        ) : record.company ? (
                          <> at {record.company}</>
                        ) : record.url ? (
                          <>
                            <a
                              href={record.url}
                              target="_blank"
                              className="underline"
                            >
                              Visit Link
                            </a>
                          </>
                        ) : null}
                      </p>
                      <Dialog>
                        <DialogTrigger>
                          <Trash2 size={14} color="red" />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-thin">
                              Are you sure?
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your project from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              className="bg-red-500 text-white"
                              onClick={() => handleRemove(record.id)}
                              disabled={btnLoading}
                            >
                              {btnLoading ? (
                                <span className="flex flex-row items-center justify-center gap-2">
                                  <Loader className="animate-spin" />
                                  Removing...
                                </span>
                              ) : (
                                <span>Remove</span>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p>{record.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Link href="/profile/work-experience">
              <Button variant="outline" size="sm">
                Add Project
              </Button>
            </Link>
          )}
        </>
      </div>
    </div>
  );
}
