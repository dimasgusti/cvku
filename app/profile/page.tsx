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
import {
  Download,
  Edit,
  Eye,
  Loader,
  PlusCircle,
  Settings,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { FaGithub } from "react-icons/fa";
import { FaLink, FaLinkedinIn } from "react-icons/fa6";
import { useIsProPlanActive } from "@/hooks/useIsProPlanActive";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

countries.registerLocale(enLocale);

interface Profile {
  username: string;
  title: string;
  country: string;
  bio: string;
  email: string;
  image: string;
  website: string;
  linkedIn: string;
  github: string;
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
  fromMonth: string;
  to: string;
  toMonth: string;
  url: string;
  company: string;
  organization: string;
  institution: string;
  fieldOfStudy: string;
  gpa: string;
  location: string;
  presentedBy: string;
  description: string;
  image: (string | StaticImageData)[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Profile() {
  const { data: session, status } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);
  const { isProPlanActive, errorMessage } = useIsProPlanActive(
    session?.user?.email || ""
  );

  const getCountryName = (countryCode: string): string => {
    if (!countryCode) return "Unknown Country";

    const upperCaseCode = countryCode.toUpperCase();
    return countries.getName(upperCaseCode, "en") || "Unknown Country";
  };

  const { data: userData } = useSWR<Profile>(
    session?.user?.email
      ? `/api/users/getUserByEmail?email=${session.user.email}`
      : null,
    fetcher
  );

  const { data: fetchedRecordData } = useSWR<Record[]>(
    session?.user?.id
      ? `/api/records/getRecord?userId=${session.user.id}`
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
    redirect("/");
  }

  if (!userData || !recordData) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
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
  const educations =
    recordData?.filter((record: Record) => record.type === "education") || [];
  const volunteers =
    recordData?.filter((record: Record) => record.type === "volunteer") || [];

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 pt-4 pb-16">
        <div className="flex flex-row justify-center w-full items-center">
          {!isProPlanActive && (
            <Link href="/profile/billing" className="w-full">
              <Button variant="secondary" className="w-full">
                Upgrade to CVKU Pro
              </Button>
            </Link>
          )}
        </div>
        {userData?.username && (
          <>
            <div className="flex flex-row justify-between items-center gap-4 py-4">
              <Link href={`/${userData.username}`} target="_blank">
                <Button variant="secondary" size="sm">
                  <Eye /> Preview
                </Button>
              </Link>
              {isProPlanActive ? (
                <Link href="/profile/pdf">
                  <Button variant="secondary" size="sm">
                    <Download />
                    Convert PDF
                  </Button>
                </Link>
              ) : (
                <Link href="/profile/pdf">
                  <Button
                    disabled
                    variant="secondary"
                    className="hover:cursor-not-allowed"
                  >
                    <Download />
                    Convert PDF
                  </Button>
                </Link>
              )}
            </div>
          </>
        )}
        <div className="flex flex-row justify-start items-center gap-4 py-4">
          <Avatar style={{ width: 100, height: 100 }}>
            <AvatarImage
              src={`${userData.image}`}
              alt={userData.username}
            />
            <AvatarFallback>CV</AvatarFallback>
          </Avatar>
          <div className="flex flex-row justify-between w-full">
            <div className="pr-4">
              {!userData?.username ? (
                <>
                  <div>
                    <p className="text-sm">{session?.user?.email}</p>
                    <p className="text-xs">
                      Thank you for signing up with CVKU!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg text-black/90">
                    {userData?.username} <br />
                  </p>
                  {userData.title ? (
                    <p className="text-sm text-black/70">💼 {userData.title}</p>
                  ) : null}
                  <p className="text-sm text-black/70">
                    📌 {getCountryName(userData.country)}
                  </p>
                </>
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
              <p className="text-lg text-black/70">About</p>
              <p className="text-sm">{userData?.bio}</p>
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
              <p className="text-lg text-black/70">Project</p>
              <Link href="/profile/project">
                <PlusCircle size={14} />
              </Link>
            </div>

            {projects.length > 0 ? (
              <div>
                {projects.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <div className="text-sm">
                      {record.year && (
                        <p>
                          {record.year === "ongoing" ? (
                            "Ongoing"
                          ) : (
                            <span>
                              {new Date(`${record.fromMonth} 1`).toLocaleString(
                                "en-US",
                                { month: "short" }
                              )}{" "}
                              {record.year}
                            </span>
                          )}
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
                      <p className="text-sm text-black/70">
                        {record.description}
                      </p>
                      {record.image && (
                        <PhotoProvider>
                          <div className="overflow-x-auto flex flex-row space-x-4">
                            {Array.isArray(record.image) ? (
                              record.image.map((imageUrl, index) => (
                                <div key={index} className="flex-shrink-0">
                                  <PhotoView
                                    src={
                                      typeof imageUrl === "string"
                                        ? imageUrl
                                        : (imageUrl as StaticImageData).src
                                    }
                                  >
                                    <Image
                                      src={imageUrl}
                                      layout="intrinsic"
                                      alt={`Image ${session?.user?.name} ${index}`}
                                      width={100}
                                      height={50}
                                      className="cursor-pointer"
                                      unoptimized
                                    />
                                  </PhotoView>
                                </div>
                              ))
                            ) : (
                              <div className="flex-shrink-0">
                                <PhotoView
                                  src={
                                    typeof record.image === "string"
                                      ? record.image
                                      : (record.image as StaticImageData).src
                                  }
                                >
                                  <Image
                                    src={record.image}
                                    layout="intrinsic"
                                    alt={`Image ${session?.user?.name}`}
                                    width={100}
                                    height={50}
                                    className="cursor-pointer"
                                    unoptimized
                                  />
                                </PhotoView>
                              </div>
                            )}
                          </div>
                        </PhotoProvider>
                      )}
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
              <p className="text-lg text-black/70">Work Experience</p>
              <Link href="/profile/work-experience">
                <PlusCircle size={14} />
              </Link>
            </div>

            {workplace.length > 0 ? (
              <div>
                {workplace.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <p className="text-sm">
                      {new Date(`${record.fromMonth} 1`).toLocaleString(
                        "en-US",
                        { month: "short" }
                      )}{" "}
                      {record.from}
                      {record.to && (
                        <span>
                          -{" "}
                          {record.to === "ongoing" ? (
                            "Ongoing"
                          ) : (
                            <span>
                              {" "}
                              {new Date(`${record.toMonth} 1`).toLocaleString(
                                "en-US",
                                { month: "short" }
                              )}{" "}
                              {record.to}
                            </span>
                          )}
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
                      <p className="text-sm text-black/70">
                        {record.description}
                      </p>
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
              <p className="text-lg text-black/70">Award</p>
              <Link href="/profile/award">
                <PlusCircle size={14} />
              </Link>
            </div>

            {awards.length > 0 ? (
              <div>
                {awards.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <div className="text-sm">{record.year}</div>
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
                      <p className="text-sm text-black/70">
                        {record.description}
                      </p>
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
              <p className="text-lg text-black/70">Certification</p>
              <Link href="/profile/certification">
                <PlusCircle size={14} />
              </Link>
            </div>

            {certifications.length > 0 ? (
              <div>
                {certifications.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <div>
                      <p className="text-sm">
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
                      <p className="text-sm text-black/70">
                        {record.description}
                      </p>
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

            <Separator className="my-4" />

            <div className="flex flex-row justify-between items-center my-4">
              <p className="text-lg text-black/70">Education</p>
              <Link href="/profile/education">
                <PlusCircle size={14} />
              </Link>
            </div>

            {educations.length > 0 ? (
              <div>
                {educations.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <div>
                      <p className="text-sm">
                        {record.from}
                        {record.to && (
                          <span>
                            {" - "}
                            {parseInt(record.to) > new Date().getFullYear()
                              ? `Expected ${record.to}`
                              : record.to}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {record.title}
                          {record.institution && record.url ? (
                            <>
                              {" "}
                              at{" "}
                              <a
                                href={record.url}
                                target="_blank"
                                className="underline"
                              >
                                {record.institution}
                              </a>
                            </>
                          ) : record.institution ? (
                            <> at {record.institution}</>
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
                      <p className="text-sm text-black/70">
                        {record.description}{" "}
                      </p>
                      <p className="text-sm text-black/70">
                        Field of Study: {record.fieldOfStudy} <br />
                        {record.gpa && `GPA: ${record.gpa}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Link href="/profile/certification">
                <Button variant="outline" size="sm">
                  Add Education
                </Button>
              </Link>
            )}

            <Separator className="my-4" />

            <div className="flex flex-row justify-between items-center my-4">
              <p className="text-lg text-black/70">Volunteer</p>
              <Link href="/profile/volunteer">
                <PlusCircle size={14} />
              </Link>
            </div>

            {volunteers.length > 0 ? (
              <div>
                {volunteers.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <div className="text-sm">
                      {record.from && (
                        <p>
                          {record.to ? (
                            <span>
                              {new Date(`${record.fromMonth} 1`).toLocaleString(
                                "en-US",
                                { month: "short" }
                              )}{" "}
                              {record.from} -{" "}
                              {new Date(`${record.toMonth} 1`).toLocaleString(
                                "en-US",
                                { month: "short" }
                              )}{" "}
                              {record.to}
                            </span>
                          ) : (
                            <span>
                              {new Date(`${record.fromMonth} 1`).toLocaleString(
                                "en-US",
                                { month: "short" }
                              )}{" "}
                              {record.from} - Ongoing
                            </span>
                          )}
                        </p>
                      )}
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
                                permanently delete your volunteer record from
                                our servers.
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
                      <p className="text-sm text-black/70">
                        {record.description}
                      </p>
                      {record.image && (
                        <PhotoProvider>
                          <div className="overflow-x-auto flex flex-row space-x-4">
                            {Array.isArray(record.image) ? (
                              record.image.map((imageUrl, index) => (
                                <div key={index} className="flex-shrink-0">
                                  <PhotoView
                                    src={
                                      typeof imageUrl === "string"
                                        ? imageUrl
                                        : (imageUrl as StaticImageData).src
                                    }
                                  >
                                    <Image
                                      src={imageUrl}
                                      layout="intrinsic"
                                      alt={`Image ${session?.user?.name} ${index}`}
                                      width={100}
                                      height={50}
                                      className="cursor-pointer"
                                      unoptimized
                                    />
                                  </PhotoView>
                                </div>
                              ))
                            ) : (
                              <div className="flex-shrink-0">
                                <PhotoView
                                  src={
                                    typeof record.image === "string"
                                      ? record.image
                                      : (record.image as StaticImageData).src
                                  }
                                >
                                  <Image
                                    src={record.image}
                                    layout="intrinsic"
                                    alt={`Image ${session?.user?.name}`}
                                    width={100}
                                    height={50}
                                    className="cursor-pointer"
                                    unoptimized
                                  />
                                </PhotoView>
                              </div>
                            )}
                          </div>
                        </PhotoProvider>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Link href="/profile/volunteer">
                <Button variant="outline" size="sm">
                  Add Volunteer
                </Button>
              </Link>
            )}

            <Separator className="my-4" />

            {userData.website || userData.linkedIn || userData.github ? (
              <div>
                <div className="flex flex-row justify-between items-center my-4">
                  <p className="text-lg text-black/70">Contact</p>
                  <Link href="/profile/settings">
                    <PlusCircle size={14} />
                  </Link>
                </div>

                {userData.website ? (
                  <div className="grid grid-cols-4 mt-2">
                    <div>
                      <FaLink size={18} />
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          <a
                            href={userData.website}
                            target="_blank"
                            className="underline"
                          >
                            {userData.website}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {userData.linkedIn ? (
                  <div className="grid grid-cols-4 mt-2">
                    <div>
                      <FaLinkedinIn size={18} />
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          <a
                            href={userData.linkedIn}
                            target="_blank"
                            className="underline"
                          >
                            {userData.linkedIn}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {userData.github ? (
                  <div className="grid grid-cols-4 mt-2">
                    <div>
                      <FaGithub size={19} />
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          <a
                            href={userData.github}
                            target="_blank"
                            className="underline"
                          >
                            {userData.github}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
