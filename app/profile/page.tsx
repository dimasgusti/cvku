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
  Edit,
  Eye,
  Loader,
  PlusCircle,
  Settings,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { FaGithub } from "react-icons/fa";
import { FaLink, FaLinkedinIn } from "react-icons/fa6";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/interfaces";

countries.registerLocale(enLocale);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ItemWithYear = {
  year?: string | number;
  fromMonth?: string;
};

type Certification = {
  issued?: string | number;
  expires?: string | number;
};

type Education = {
  from?: string | number;
  to?: string | number;
};

export default function Profile() {
  const { data: session, status } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);
  const router = useRouter();

  const getCountryName = (countryCode: string): string => {
    if (!countryCode) return "Unknown Country";

    const upperCaseCode = countryCode.toUpperCase();
    return countries.getName(upperCaseCode, "en") || "Unknown Country";
  };

  const handleOpen = () => {
    if (user?.username) {
      window.open(`/${user.username}`, "_blank");
    }
  };

  const handleRemove = async (type: string, itemId: string) => {
    setBtnLoading(true);
    try {
      const response = await fetch(`/api/users/deleteItem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          type,
          itemId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          `${type.charAt(0).toUpperCase() + type.slice(1)} failed to delete: ${
            result.error
          }`
        );
      } else {
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
        );
        setBtnLoading(false);
        mutate(`/api/users/getUser?email=${session?.user?.email}`);
      }
    } catch (error) {
      console.error(`Failed to remove ${type}`, error);
      toast.error(`An error occurred while trying to remove ${type}`);
      setBtnLoading(false);
    }
  };

  const sortByDate = (
    a: ItemWithYear | Certification | Education,
    b: ItemWithYear | Certification | Education
  ): number => {
    const getYear = (
      item: ItemWithYear | Certification | Education
    ): number => {
      if ("year" in item && item.year) {
        return typeof item.year === "string" && item.year !== "ongoing"
          ? new Date(`${item.fromMonth || "Jan"} 1, ${item.year}`).getTime()
          : 0;
      }

      if ("issued" in item && item.issued) {
        return new Date(item.issued).getTime();
      }

      if ("from" in item && item.from) {
        return new Date(item.from).getTime();
      }

      return 0;
    };

    const yearA = getYear(a);
    const yearB = getYear(b);

    if (
      "year" in a &&
      a.year === "ongoing" &&
      "year" in b &&
      b.year !== "ongoing"
    )
      return -1;
    if (
      "year" in b &&
      b.year === "ongoing" &&
      "year" in a &&
      a.year !== "ongoing"
    )
      return 1;

    return yearB - yearA;
  };

  const { data: user } = useSWR<Profile>(
    session?.user?.email
      ? `/api/users/getUser?email=${session.user.email}`
      : null,
    fetcher
  );

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }
  if (status === "loading" || !user) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 pt-4 pb-16">
        {user?.username && (
          <>
            <div className="flex flex-row justify-between items-center gap-4 py-4">
              <Link href={`/${user.username}`} target="_blank">
                <Button variant="secondary" size="sm">
                  <Eye /> Preview
                </Button>
              </Link>
            </div>
          </>
        )}
        <div className="flex flex-row justify-start items-center gap-4 py-4">
          <Avatar style={{ width: 100, height: 100 }}>
            <AvatarImage src={`${user?.image}`} alt={user?.username} />
            <AvatarFallback>CV</AvatarFallback>
          </Avatar>
          <div className="flex flex-row justify-between w-full">
            <div className="pr-4">
              {!user?.username ? (
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
                  <p className="text-lg text-black/90 flex flex-row gap-2 items-center">
                    {user?.username}{" "}
                    <span className="flex flex-row gap-1 items-center text-sm text-green-700">
                      <TrendingUp size={16} />
                      {user.viewCount}
                    </span>
                  </p>
                  {user.title ? (
                    <p className="text-sm text-black/70">💼 {user.title}</p>
                  ) : null}
                  <p className="text-sm text-black/70">
                    🌏 {getCountryName(user.country)}
                  </p>
                </>
              )}
            </div>
            <div>
              {!user?.username ? null : (
                <>
                  <div className="flex flex-row flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={handleOpen}>
                      <Eye />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/profile/settings")}
                    >
                      <Settings />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {user?.bio ? (
          <>
            <div className="pb-4">
              <p className="text-lg text-black/70">About</p>
              <p className="text-sm">{user?.bio}</p>
            </div>
          </>
        ) : null}
        <Separator />
        {!user?.username ? (
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

            {user.project ? (
              <div>
                {user.project.sort(sortByDate).map((project) => (
                  <div key={project._id} className="grid grid-cols-4 mt-2">
                    <div className="text-sm">
                      {project.year && (
                        <p>
                          {project.year === "ongoing" ? (
                            "Ongoing"
                          ) : (
                            <span>
                              {new Date(
                                `${project.fromMonth} 1`
                              ).toLocaleString("en-US", {
                                month: "short",
                              })}{" "}
                              {project.year}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {project.title}
                          {project.company && project.url ? (
                            <>
                              {" "}
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
                            <> at {project.company}</>
                          ) : project.url ? (
                            <>
                              {" "}
                              <a
                                href={project.url}
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
                                onClick={() =>
                                  handleRemove("project", project._id)
                                }
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
                      <p className="text-sm text-black/70 py-1">
                        {project.description}
                      </p>
                      {project.images && (
                        <PhotoProvider>
                          <div className="overflow-x-auto flex flex-row space-x-4">
                            {Array.isArray(project.images) ? (
                              project.images.map((imageUrl, index) => (
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
                                      layout="intrisinic"
                                      alt={`Image ${user.username} ${index}`}
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
                                    typeof project.images === "string"
                                      ? project.images
                                      : (project.images as StaticImageData).src
                                  }
                                >
                                  <Image
                                    src={project.images}
                                    layout="intrisinic"
                                    alt={`Image ${user.username}`}
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

            {user.experience ? (
              <div>
                {user.experience.sort(sortByDate).map((experience) => (
                  <div key={experience._id} className="grid grid-cols-4 mt-2">
                    <p className="text-sm">
                      {new Date(`${experience.fromMonth} 1`).toLocaleString(
                        "en-US",
                        { month: "short" }
                      )}{" "}
                      {experience.from}
                      {experience.to && (
                        <span>
                          {" "}
                          -{" "}
                          {experience.to === "ongoing" ? (
                            "Ongoing"
                          ) : (
                            <span>
                              {" "}
                              {new Date(
                                `${experience.toMonth} 1`
                              ).toLocaleString("en-US", {
                                month: "short",
                              })}{" "}
                              {experience.to}
                            </span>
                          )}
                        </span>
                      )}
                    </p>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {experience.title}
                          {experience.company && experience.url ? (
                            <>
                              {" "}
                              at{" "}
                              <a
                                href={experience.url}
                                target="_blank"
                                className="underline"
                              >
                                {experience.company}
                              </a>
                            </>
                          ) : experience.company ? (
                            <> at {experience.company}</>
                          ) : experience.url ? (
                            <>
                              <a
                                href={experience.url}
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
                                onClick={() =>
                                  handleRemove("experience", experience._id)
                                }
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
                      <p className="text-sm text-black/70 py-1">
                        {experience.description}
                      </p>
                      {experience.images && (
                        <PhotoProvider>
                          <div className="overflow-x-auto flex flex-row space-x-4">
                            {Array.isArray(experience.images) ? (
                              experience.images.map((imageUrl, index) => (
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
                                      layout="intrisinic"
                                      alt={`Image ${user.username} ${index}`}
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
                                    typeof experience.images === "string"
                                      ? experience.images
                                      : (experience.images as StaticImageData)
                                          .src
                                  }
                                >
                                  <Image
                                    src={experience.images}
                                    layout="intrisinic"
                                    alt={`Image ${user.username}`}
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
              <Link href="/profile/work-experience">
                <Button variant="outline" size="sm">
                  Add Work Experience
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

            {user.award ? (
              <div>
                {user.award.sort(sortByDate).map((award) => (
                  <div key={award._id} className="grid grid-cols-4 mt-2">
                    <div className="text-sm">{award.year}</div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {award.title}
                          {award.presentedBy && award.url ? (
                            <>
                              {" "}
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
                            <> at {award.presentedBy}</>
                          ) : award.url ? (
                            <>
                              <a
                                href={award.url}
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
                                onClick={() => handleRemove("award", award._id)}
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
                      <p className="text-sm text-black/70 py-1">
                        {award.description}
                      </p>
                      {award.images && (
                        <PhotoProvider>
                          <div className="overflow-x-auto flex flex-row space-x-4">
                            {Array.isArray(award.images) ? (
                              award.images.map((imageUrl, index) => (
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
                                      layout="intrisinic"
                                      alt={`Image ${user.username} ${index}`}
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
                                    typeof award.images === "string"
                                      ? award.images
                                      : (award.images as StaticImageData).src
                                  }
                                >
                                  <Image
                                    src={award.images}
                                    layout="intrisinic"
                                    alt={`Image ${user.username}`}
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

            {user.certification ? (
              <div>
                {user.certification.sort(sortByDate).map((certification) => (
                  <div
                    key={certification._id}
                    className="grid grid-cols-4 mt-2"
                  >
                    <div>
                      <p className="text-sm">
                        {certification.issued}
                        {certification.expires && (
                          <span>
                            {" - "}
                            {certification.expires === "doesNotExpire"
                              ? "No Expiry"
                              : `Expires ${certification.expires}`}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {certification.title}
                          {certification.organization && certification.url ? (
                            <>
                              {" "}
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
                            <> at {certification.organization}</>
                          ) : certification.url ? (
                            <>
                              <a
                                href={certification.url}
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
                                onClick={() =>
                                  handleRemove(
                                    "certification",
                                    certification._id
                                  )
                                }
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
                      <p className="text-sm text-black/70 py-1">
                        {certification.description}
                      </p>
                      {certification.images && (
                        <PhotoProvider>
                          <div className="overflow-x-auto flex flex-row space-x-4">
                            {Array.isArray(certification.images) ? (
                              certification.images.map((imageUrl, index) => (
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
                                      layout="intrisinic"
                                      alt={`Image ${user.username} ${index}`}
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
                                    typeof certification.images === "string"
                                      ? certification.images
                                      : (
                                          certification.images as StaticImageData
                                        ).src
                                  }
                                >
                                  <Image
                                    src={certification.images}
                                    layout="intrisinic"
                                    alt={`Image ${user.username}`}
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

            {user.education ? (
              <div>
                {user.education.sort(sortByDate).map((education) => (
                  <div key={education._id} className="grid grid-cols-4 mt-2">
                    <div>
                      <p className="text-sm">
                        {education.from}
                        {education.to && (
                          <span>
                            {" - "}
                            {parseInt(education.to) > new Date().getFullYear()
                              ? `Expected ${education.to}`
                              : education.to}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {education.title}
                          {education.institution && education.url ? (
                            <>
                              {" "}
                              at{" "}
                              <a
                                href={education.url}
                                target="_blank"
                                className="underline"
                              >
                                {education.institution}
                              </a>
                            </>
                          ) : education.institution ? (
                            <> at {education.institution}</>
                          ) : education.url ? (
                            <>
                              <a
                                href={education.url}
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
                                onClick={() =>
                                  handleRemove("education", education._id)
                                }
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
                      <p className="text-sm text-black/70 py-1">
                        Field of Study: {education.fieldOfStudy} <br />
                        {education.gpa && `GPA: ${education.gpa}`}
                      </p>
                      <p className="text-sm text-black/70 py-1">
                        {education.description}
                      </p>
                      {education.images && (
                        <PhotoProvider>
                          <div className="overflow-x-auto flex flex-row space-x-4">
                            {Array.isArray(education.images) ? (
                              education.images.map((imageUrl, index) => (
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
                                      layout="intrisinic"
                                      alt={`Image ${user.username} ${index}`}
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
                                    typeof education.images === "string"
                                      ? education.images
                                      : (education.images as StaticImageData)
                                          .src
                                  }
                                >
                                  <Image
                                    src={education.images}
                                    layout="intrisinic"
                                    alt={`Image ${user.username}`}
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
              <Link href="/profile/education">
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

            {user.volunteer ? (
              <div>
                {user.volunteer.sort(sortByDate).map((volunteer) => (
                  <div key={volunteer._id} className="grid grid-cols-4 mt-2">
                    <div className="text-sm">
                      {volunteer.from && (
                        <p>
                          {volunteer.to === "ongoing" ? (
                            <span>
                              {new Date(
                                `${volunteer.fromMonth} 1`
                              ).toLocaleString("en-US", {
                                month: "short",
                              })}{" "}
                              {volunteer.from} - Ongoing
                            </span>
                          ) : (
                            <span>
                              {new Date(
                                `${volunteer.fromMonth} 1`
                              ).toLocaleString("en-US", {
                                month: "short",
                              })}{" "}
                              {volunteer.from} -{" "}
                              {new Date(
                                `${volunteer.toMonth} 1`
                              ).toLocaleString("en-US", {
                                month: "short",
                              })}{" "}
                              {volunteer.to}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          {volunteer.title}
                          {volunteer.organization && volunteer.url ? (
                            <>
                              {" "}
                              at{" "}
                              <a
                                href={volunteer.url}
                                target="_blank"
                                className="underline"
                              >
                                {volunteer.organization}
                              </a>
                            </>
                          ) : volunteer.organization ? (
                            <> at {volunteer.organization}</>
                          ) : volunteer.url ? (
                            <>
                              <a
                                href={volunteer.url}
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
                                onClick={() =>
                                  handleRemove("volunteer", volunteer._id)
                                }
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
                      <p className="text-sm text-black/70 py-1">
                        {volunteer.description}
                      </p>
                      {volunteer.images && (
                        <PhotoProvider>
                          <div className="overflow-x-auto flex flex-row space-x-4">
                            {Array.isArray(volunteer.images) ? (
                              volunteer.images.map((imageUrl, index) => (
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
                                      layout="intrisinic"
                                      alt={`Image ${user.username} ${index}`}
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
                                    typeof volunteer.images === "string"
                                      ? volunteer.images
                                      : (volunteer.images as StaticImageData)
                                          .src
                                  }
                                >
                                  <Image
                                    src={volunteer.images}
                                    layout="intrisinic"
                                    alt={`Image ${user.username}`}
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

            {user.website || user.linkedIn || user.github ? (
              <div>
                <div className="flex flex-row justify-between items-center my-4">
                  <p className="text-lg text-black/70">Contact</p>
                  <Link href="/profile/settings">
                    <PlusCircle size={14} />
                  </Link>
                </div>

                {user.website ? (
                  <div className="grid grid-cols-4 mt-2">
                    <div>
                      <FaLink size={18} />
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          <a
                            href={user.website}
                            target="_blank"
                            className="underline"
                          >
                            {user.website}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {user.linkedIn ? (
                  <div className="grid grid-cols-4 mt-2">
                    <div>
                      <FaLinkedinIn size={18} />
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          <a
                            href={user.linkedIn}
                            target="_blank"
                            className="underline"
                          >
                            {user.linkedIn}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {user.github ? (
                  <div className="grid grid-cols-4 mt-2">
                    <div>
                      <FaGithub size={19} />
                    </div>
                    <div className="col-start-2 col-end-5">
                      <div className="flex flex-row justify-between">
                        <p>
                          <a
                            href={user.github}
                            target="_blank"
                            className="underline"
                          >
                            {user.github}
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
