"use client";

import Image, { StaticImageData } from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/interfaces";
import { Button } from "../ui/button";
import { Github, Globe, Linkedin } from "lucide-react";
import { Separator } from "../ui/separator";

interface DefaultTemplateProps {
  user: Profile;
}

// export  interface Profile {
//     _id: string;
//     private: boolean;
//     template: number;
//     username: string;
//     title: string;
//     country: string;
//     bio: string;
//     email: string;
//     image: string;
//     website: string;
//     linkedIn: string;
//     github: string;
//     project: Project[];
//     experience: Experience[];
//     award: Award[];
//     certification: Certification[];
//     education: Education[];
//     volunteer: Volunteer[];
//     viewCount: number;
//     viewHistory: ViewHistory[];
// }

export default function MinimalistTemplate({ user }: DefaultTemplateProps) {
  const hasRecords =
    (user?.project.length ?? 0) > 0 ||
    (user?.experience?.length ?? 0) > 0 ||
    (user?.award?.length ?? 0) > 0 ||
    (user?.certification?.length ?? 0) > 0 ||
    (user?.education?.length ?? 0) > 0 ||
    (user?.volunteer?.length ?? 0) > 0;

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-[640px]">
        <div className="w-full flex flex-col justify-start items-start px-4">
          <div className="flex flex-row justify-start w-full items-center gap-4 py-4">
            <Avatar style={{ width: 100, height: 100 }}>
              <AvatarImage src={`${user.image}`} alt={user.username} />
              <AvatarFallback>CV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-semibold">
                {user.username}
              </h2>
              <p>{user.title}</p>
            </div>
          </div>
          <div className="py-4">
            <h3 className="text-lg md:text-xl">About me</h3>
            {user.bio ? user.bio : "No bio available."}
          </div>
          {user.website || user.linkedIn || user.github ? (
            <>
              <div className="py-4">
                <h3 className="text-lg md:text-xl mb-1">Contact me</h3>
                <div className="flex flex-row gap-4">
                  {user.linkedIn && (
                    <Button className="bg-blue-500" size="lg">
                      <Linkedin color="white" />
                    </Button>
                  )}
                  {user.github && (
                    <Button className="bg-black" size="lg">
                      <Github color="white" />
                    </Button>
                  )}
                  {user.website && (
                    <Button className="bg-red-500" size="lg">
                      <Globe color="white" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
        <div className="w-full flex flex-col justify-start items-start px-4">
          <div className="flex flex-col justify-start w-full items-start gap-4 py-4">
            {!user.private ? (
              <>
                {hasRecords ? (
                  <>
                    {user.project.length > 0 && (
                      <>
                        <Separator />
                        <h2 className="text-xl md:text-2xl">Project</h2>
                        <div className="grid grid-cols-1 gap-4 w-full">
                          {user.project.map((project, index) => (
                            <div key={index} className="flex flex-col gap-1">
                              <h4 className="text-md md:text-lg flex justify-between items-end font-semibold">
                                {project.title}
                                <span className="text-sm">
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
                                  ) : (
                                    project.url && (
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
                                    )
                                  )}
                                </span>
                              </h4>
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
                              <p>{project.description}</p>
                              {project.images && (
                                <PhotoProvider>
                                  <div className="overflow-x-auto flex flex-row space-x-4">
                                    {Array.isArray(project.images) ? (
                                      project.images.map((imageUrl, index) => (
                                        <div
                                          key={index}
                                          className="flex-shrink-0"
                                        >
                                          <PhotoView
                                            src={
                                              typeof imageUrl === "string"
                                                ? imageUrl
                                                : (imageUrl as StaticImageData)
                                                    .src
                                            }
                                          >
                                            <Image
                                              src={imageUrl}
                                              layout="intrinsic"
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
                                              : (
                                                  project.images as StaticImageData
                                                ).src
                                          }
                                        >
                                          <Image
                                            src={project.images}
                                            layout="intrinsic"
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
                          ))}
                        </div>
                      </>
                    )}

                    {user.experience.length > 0 && (
                      <>
                        <Separator />
                        <h2 className="text-xl md:text-2xl">Work Experience</h2>
                        <div className="grid grid-cols-1 gap-4 w-full">
                          {user.experience.map((experience, index) => (
                            <div key={index} className="flex flex-col gap-1">
                              <h4 className="text-md md:text-lg flex justify-between items-end font-semibold">
                                {experience.title}
                                <span className="text-sm">
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
                                  ) : (
                                    experience.url && (
                                      <>
                                        {" "}
                                        <a
                                          href={experience.url}
                                          target="_blank"
                                          className="underline"
                                        >
                                          Visit Link
                                        </a>
                                      </>
                                    )
                                  )}
                                </span>
                              </h4>
                              <p>
                                {new Date(
                                  `${experience.fromMonth} 1`
                                ).toLocaleString("en-US", {
                                  month: "short",
                                })}{" "}
                                {experience.from}{" "}
                                {experience.to && (
                                  <span>
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
                              <p>{experience.description}</p>
                              {experience.images && (
                                <PhotoProvider>
                                  <div className="overflow-x-auto flex flex-row space-x-4">
                                    {Array.isArray(experience.images) ? (
                                      experience.images.map(
                                        (imageUrl, index) => (
                                          <div
                                            key={index}
                                            className="flex-shrink-0"
                                          >
                                            <PhotoView
                                              src={
                                                typeof imageUrl === "string"
                                                  ? imageUrl
                                                  : (
                                                      imageUrl as StaticImageData
                                                    ).src
                                              }
                                            >
                                              <Image
                                                src={imageUrl}
                                                layout="intrinsic"
                                                alt={`Image ${user.username} ${index}`}
                                                width={100}
                                                height={50}
                                                className="cursor-pointer"
                                                unoptimized
                                              />
                                            </PhotoView>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <div className="flex-shrink-0">
                                        <PhotoView
                                          src={
                                            typeof experience.images ===
                                            "string"
                                              ? experience.images
                                              : (
                                                  experience.images as StaticImageData
                                                ).src
                                          }
                                        >
                                          <Image
                                            src={experience.images}
                                            layout="intrinsic"
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
                          ))}
                        </div>
                      </>
                    )}

                    {user.award.length > 0 && (
                      <>
                        <Separator />
                        <h2 className="text-xl md:text-2xl">Award</h2>
                        <div className="grid grid-cols-1 gap-4 w-full">
                          {user.award.map((award, index) => (
                            <div key={index} className="flex flex-col gap-1">
                              <h4 className="text-md md:text-lg flex justify-between items-end font-semibold">
                                {award.title}
                                <span>
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
                                  ) : (
                                    award.url && (
                                      <>
                                        <a
                                          href={award.url}
                                          target="_blank"
                                          className="underline"
                                        >
                                          Visit Link
                                        </a>
                                      </>
                                    )
                                  )}
                                </span>
                              </h4>
                              {award.year && <p>{award.year}</p>}
                              <p>{award.description}</p>
                              {award.images && (
                                <PhotoProvider>
                                  <div className="overflow-x-auto flex flex-row space-x-4">
                                    {Array.isArray(award.images) ? (
                                      award.images.map((imageUrl, index) => (
                                        <div
                                          key={index}
                                          className="flex-shrink-0"
                                        >
                                          <PhotoView
                                            src={
                                              typeof imageUrl === "string"
                                                ? imageUrl
                                                : (imageUrl as StaticImageData)
                                                    .src
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
                                              : (
                                                  award.images as StaticImageData
                                                ).src
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
                          ))}
                        </div>
                      </>
                    )}

                    {user.certification.length > 0 && (
                      <>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center h-32 w-full">
                    <p>No posts yet.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-32 w-full">
                <p>Account is private.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
