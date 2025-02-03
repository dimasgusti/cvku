"use client";

import Image, { StaticImageData } from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/interfaces";
import { Button } from "../ui/button";
import { Github, Globe, Linkedin } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import countries from "i18n-iso-countries";

interface DefaultTemplateProps {
  user: Profile;
}

export default function MinimalistTemplate({ user }: DefaultTemplateProps) {
  const hasRecords =
    (user?.project.length ?? 0) > 0 ||
    (user?.experience?.length ?? 0) > 0 ||
    (user?.award?.length ?? 0) > 0 ||
    (user?.certification?.length ?? 0) > 0 ||
    (user?.education?.length ?? 0) > 0 ||
    (user?.volunteer?.length ?? 0) > 0;

  const getCountryName = (countryCode: string): string => {
    if (!countryCode) return "Unknown Country";

    const upperCaseCode = countryCode.toUpperCase();
    return countries.getName(upperCaseCode, "en") || "Unknown Country";
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-[720px]">
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
              <p className="text-sm text-black/70">{user.title}</p>
              {user.country && (
                <p className="text-sm text-black/70">
                  🌏 {getCountryName(user?.country)}
                </p>
              )}
            </div>
          </div>
          <div className="py-4">
            <h3 className="text-lg md:text-xl">About me</h3>
            {user.bio ? user.bio : "No bio available."}
          </div>
          {user.website || user.linkedIn || user.github ? (
            <>
              <div className="py-4 w-full">
                <h3 className="text-lg md:text-xl mb-1">Contact</h3>
                <div className="flex flex-col gap-4">
                  {user.linkedIn && (
                    <a
                      href={`https://linkedin.com/in/${user.linkedIn}`}
                      target="_blank"
                      className="underline"
                    >
                      <Button className="bg-blue-500 w-full" size="lg">
                        <Linkedin color="white" />
                      </Button>
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      className="underline"
                    >
                      <Button className="bg-black w-full" size="lg">
                        <Github color="white" />
                      </Button>
                    </a>
                  )}
                  {user.website && (
                    <a
                      href={`${user.website}`}
                      target="_blank"
                      className="underline"
                    >
                      <Button className="bg-red-500 w-full" size="lg">
                        <Globe color="white" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
        <ScrollArea className="h-full md:h-[100vh]">
          <div className="w-full flex flex-col justify-start items-start px-4 ">
            <div className="flex flex-col justify-start w-full items-start gap-4 py-4">
              {!user.private ? (
                <>
                  {hasRecords ? (
                    <>
                      {user.project.length > 0 && (
                        <>
                          <Separator />
                          <h2 className="text-lg md:text-xl">Project</h2>
                          <div className="grid grid-cols-1 gap-4 w-full">
                            {user.project.map((project, index) => (
                              <div key={index} className="flex flex-col gap-1">
                                <h4 className="text-lg md:text-xl font-semibold flex-col justify-between items-end">
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
                                        project.images.map(
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
                          <h2 className="text-lg md:text-xl">
                            Work Experience
                          </h2>
                          <div className="grid grid-cols-1 gap-4 w-full">
                            {user.experience.map((experience, index) => (
                              <div key={index} className="flex flex-col gap-1">
                                <h4 className="text-lg md:text-xl font-semibold flex-col justify-between items-end">
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
                          <h2 className="text-lg md:text-xl">Award</h2>
                          <div className="grid grid-cols-1 gap-4 w-full">
                            {user.award.map((award, index) => (
                              <div key={index} className="flex flex-col gap-1">
                                <h4 className="text-lg md:text-xl font-semibold flex-col justify-between items-end">
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
                                                  : (
                                                      imageUrl as StaticImageData
                                                    ).src
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
                          <Separator />
                          <h2 className="text-lg md:text-xl">Certification</h2>
                          <div className="grid grid-cols-1 gap-4 w-full">
                            {user.certification.map((certification, index) => (
                              <div key={index} className="flex flex-col gap-1">
                                <h4 className="text-lg md:text-xl font-semibold flex-col justify-between items-end">
                                  {certification.title}
                                  <span className="text-sm">
                                    {certification.organization &&
                                    certification.url ? (
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
                                    ) : (
                                      certification.url && (
                                        <>
                                          <a
                                            href={certification.url}
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
                                <p>{certification.description}</p>
                                {certification.images && (
                                  <PhotoProvider>
                                    <div className="overflow-x-auto flex flex-row space-x-4">
                                      {Array.isArray(certification.images) ? (
                                        certification.images.map(
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
                                                  layout="intrisinic"
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
                                              typeof certification.images ===
                                              "string"
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
                            ))}
                          </div>
                        </>
                      )}

                      {user.education.length > 0 && (
                        <>
                          <Separator />
                          <h2 className="text-lg md:text-xl">Education</h2>
                          <div className="grid grid-cols-1 gap-4 w-full">
                            {user.education.map((education, index) => (
                              <div key={index} className="flex flex-col gap-1">
                                <h4 className="text-lg md:text-xl font-semibold flex-col justify-between items-end">
                                  {education.title}
                                  <span className="text-sm">
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
                                    ) : (
                                      education.url && (
                                        <>
                                          <a
                                            href={education.url}
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
                                  {education.from}
                                  {education.to && (
                                    <span>
                                      {" - "}
                                      {parseInt(education.to) >
                                      new Date().getFullYear()
                                        ? `Expected ${education.to}`
                                        : education.to}
                                    </span>
                                  )}
                                </p>
                                <p>{education.description}</p>
                                {education.images && (
                                  <PhotoProvider>
                                    <div className="overflow-x-auto flex flex-row space-x-4">
                                      {Array.isArray(education.images) ? (
                                        education.images.map(
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
                                                  layout="intrisinic"
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
                                              typeof education.images ===
                                              "string"
                                                ? education.images
                                                : (
                                                    education.images as StaticImageData
                                                  ).src
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
                            ))}

                            {user.volunteer.length > 0 && (
                              <>
                                <Separator />
                                <h2 className="text-lg md:text-xl">
                                  Volunteer
                                </h2>
                                <div className="grid grid-cols-1 gap-4 w-full">
                                  {user.volunteer.map((volunteer, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col gap-1"
                                    >
                                      <h4 className="text-lg md:text-xl font-semibold flex-col justify-between items-end">
                                        {volunteer.title}
                                        <span className="text-sm">
                                          {volunteer.organization &&
                                          volunteer.url ? (
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
                                          ) : (
                                            volunteer.url && (
                                              <>
                                                <a
                                                  href={volunteer.url}
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
                                      {volunteer.from && (
                                        <p>
                                          {volunteer.to ? (
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
                                          ) : (
                                            <span>
                                              {new Date(
                                                `${volunteer.fromMonth} 1`
                                              ).toLocaleString("en-US", {
                                                month: "short",
                                              })}{" "}
                                              {volunteer.from} - Ongoing
                                            </span>
                                          )}
                                        </p>
                                      )}
                                      <p>{volunteer.description}</p>
                                      {volunteer.images && (
                                        <PhotoProvider>
                                          <div className="overflow-x-auto flex flex-row space-x-4">
                                            {Array.isArray(volunteer.images) ? (
                                              volunteer.images.map(
                                                (imageUrl, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex-shrink-0"
                                                  >
                                                    <PhotoView
                                                      src={
                                                        typeof imageUrl ===
                                                        "string"
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
                                                    typeof volunteer.images ===
                                                    "string"
                                                      ? volunteer.images
                                                      : (
                                                          volunteer.images as StaticImageData
                                                        ).src
                                                  }
                                                >
                                                  <Image
                                                    src={volunteer.images}
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
                          </div>
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
        </ScrollArea>
      </div>
    </div>
  );
}
