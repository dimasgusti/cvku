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
import { Edit, Loader, PlusCircle, Settings, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Profile() {
  const { data: session, status } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return "";
    return String.fromCodePoint(
      ...[...countryCode.toUpperCase()].map(
        (c) => 0x1f1e6 - 65 + c.charCodeAt(0)
      )
    );
  };

  const { data: userData, error: userError } = useSWR<Profile>(
    session?.user?.email
      ? `/api/users/getUserByEmail?email=${session.user.email}`
      : null,
    fetcher
  );

  const { data: fetchedRecordData, error: recordError } = useSWR<Record[]>(
    session?.user?.id
      ? `/api/records/getRecordById?userId=${session.user.id}`
      : null,
    fetcher
  );

  const [recordData, setRecordData] = useState<Record[]>([]);

  useEffect(() => {
    if (fetchedRecordData) {
      setRecordData(fetchedRecordData);
    }
  }, [fetchedRecordData]);

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

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  if (!userData || !recordData) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  const projects =
    recordData?.filter((record: Record) => record.type === "project") || [];
  const workplace =
    recordData?.filter((record: Record) => record.type === "workplace") || [];
  const awards =
    recordData?.filter((record: Record) => record.type === "award") || [];
  const certifications =
    recordData?.filter((record: Record) => record.type === "certification") ||
    [];

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
              {!userData?.username ? (
                <>
                  <div>
                    <p>{userData?.email}</p>
                    <p>Thank you for signing up with CVKU!</p>
                  </div>
                </>
              ) : (
                <p>
                  {userData?.username} <br />
                  <span>
                    {userData?.title} from {getFlagEmoji(userData?.country)}
                  </span>
                </p>
              )}
            </div>
            <div>
              {!userData?.username ? null : (
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
        {!userData?.username ? (
          <>
            <div className="flex flex-col justify-center items-center h-40">
              <h2 className="text-xl md:text-2xl pb-2">
                Complete this step to continue.
              </h2>
              <Link href="/profile/settings">
                <Button>
                  <Edit /> Start
                </Button>
              </Link>
            </div>
          </>
        ) : (
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
                                permanently delete your project from our
                                servers.
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
                                permanently delete your project from our
                                servers.
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

            <Separator className="my-4" />

            <div className="flex flex-row justify-between items-center my-4">
              <p>Award</p>
              <Link href="/profile/award">
                <PlusCircle size={14} />
              </Link>
            </div>

            {awards.length > 0 ? (
              <div>
                {awards.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <div>{record.year}</div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {record.title}
                          {record.presentedBy && record.url ? (
                            <>
                              {" "}
                              at{" "}
                              <a
                                href={record.url}
                                target="_blank"
                                className="underline"
                              >
                                {record.presentedBy}
                              </a>
                            </>
                          ) : record.presentedBy ? (
                            <> at {record.presentedBy}</>
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
                                permanently delete your project from our
                                servers.
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
              <Link href="/profile/award">
                <Button variant="outline" size="sm">
                  Add Award
                </Button>
              </Link>
            )}

            <Separator className="my-4" />

            <div className="flex flex-row justify-between items-center my-4">
              <p>Certification</p>
              <Link href="/profile/certification">
                <PlusCircle size={14} />
              </Link>
            </div>

            {certifications.length > 0 ? (
              <div>
                {certifications.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <div>
                      <p>
                        {record.issued}
                        {record.expires && (
                          <span>
                            {" - "}
                            {record.expires === "doesNotExpire"
                              ? "No Expiry"
                              : `Expires ${record.expires}`}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {record.title}
                          {record.organization && record.url ? (
                            <>
                              {" "}
                              at{" "}
                              <a
                                href={record.url}
                                target="_blank"
                                className="underline"
                              >
                                {record.organization}
                              </a>
                            </>
                          ) : record.organization ? (
                            <> at {record.organization}</>
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
                                permanently delete your project from our
                                servers.
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
              <Link href="/profile/certification">
                <Button variant="outline" size="sm">
                  Add Award
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
