"use client";

import countries from "i18n-iso-countries";
import Image, { StaticImageData } from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { FaGithub } from "react-icons/fa";
import { FaLink, FaLinkedinIn } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/interfaces";
import { useEffect, useState } from "react";

interface DefaultTemplateProps {
  user: Profile;
}

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

export default function DefaultTemplate({ user }: DefaultTemplateProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  });

  const getCountryName = (countryCode: string): string => {
    if (!countryCode) return "Unknown Country";

    const upperCaseCode = countryCode.toUpperCase();
    return countries.getName(upperCaseCode, "en") || "Unknown Country";
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

  const hasRecords =
    (user?.project ?? []).length > 0 ||
    (user?.experience ?? []).length > 0 ||
    (user?.award ?? []).length > 0 ||
    (user?.certification ?? []).length > 0 ||
    (user?.education ?? []).length > 0 ||
    (user?.volunteer ?? []).length > 0;

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full md:w-[560px] lg:w-[640px] min-h-96 px-4 pt-4 pb-16">
        <div className="flex flex-row justify-start w-full items-center gap-4 py-4">
          <Avatar style={{ width: 100, height: 100 }}>
            <AvatarImage src={`${user.image}`} alt={user.username} />
            <AvatarFallback>CV</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-lg text-black/90">
              {user?.username} <br />
            </p>
            {user.title ? (
              <p className="text-sm text-black/70">💼 {user.title}</p>
            ) : null}
            {isClient && user?.country && (
              <p className="text-sm text-black/70">
                🌏 {getCountryName(user?.country)}
              </p>
            )}
          </div>
        </div>
        {user?.bio ? (
          <>
            <div className="pb-4">
              <p className="text-lg text-black/70">About</p>
              <p className="text-sm whitespace-pre-line">{user?.bio}</p>
            </div>
          </>
        ) : null}

        {!user.private ? (
          <>
            {hasRecords ? (
              <>
                {user.experience.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-row justify-between items-center my-4">
                      <p className="text-lg text-black/70">Work Experience</p>
                    </div>
                    <div>
                      {user.experience
                        .sort(sortByDate)
                        .map((experience, index) => (
                          <div key={index} className="grid grid-cols-4 mt-2">
                            <p className="text-sm pr-1">
                              {new Date(
                                `${experience.fromMonth} 1`
                              ).toLocaleString("en-US", {
                                month: "short",
                              })}{" "}
                              {experience.from}
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
                              </div>
                              <p className="text-sm text-black/70">
                                {experience.description}
                              </p>
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
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {user.project.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-row justify-between items-center my-4">
                      <p className="text-lg text-black/70">Project</p>
                    </div>
                    <div>
                      {user.project.sort(sortByDate).map((project, index) => (
                        <div key={index} className="grid grid-cols-4 mt-2">
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
                            </div>
                            <p className="text-sm text-black/70">
                              {project.description}
                            </p>
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
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {user.education.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-row justify-between items-center my-4">
                      <p className="text-lg text-black/70">Education</p>
                    </div>
                    <div>
                      {user.education
                        .sort(sortByDate)
                        .map((education, index) => (
                          <div key={index} className="grid grid-cols-4 mt-2">
                            <div>
                              <p className="text-sm">
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
                              </div>
                              <p className="text-sm text-black/70">
                                {education.description}{" "}
                              </p>
                              <p className="text-sm text-black/70">
                                Field of Study: {education.fieldOfStudy} <br />
                                {education.gpa && `GPA: ${education.gpa}`}
                              </p>
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
                                            typeof education.images === "string"
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
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {user.skills.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-row justify-between items-center my-4">
                      <p className="text-lg text-black/70">Skill</p>
                    </div>
                    <div>
                      {user.skills && (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="px-3 py-1 bg-gray-300 rounded"
                            >
                              <p>{skill}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {user.certification.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-row justify-between items-center my-4">
                      <p className="text-lg text-black/70">Certification</p>
                    </div>
                    <div>
                      {user.certification
                        .sort(sortByDate)
                        .map((certification, index) => (
                          <div key={index} className="grid grid-cols-4 mt-2">
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
                              </div>
                              <p className="text-sm text-black/70">
                                {certification.description}
                              </p>
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
                          </div>
                        ))}
                    </div>
                  </>
                )}
                {user.award.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-row justify-between items-center my-4">
                      <p className="text-lg text-black/70">Award</p>
                    </div>
                    <div>
                      {user.award.sort(sortByDate).map((award, index) => (
                        <div key={index} className="grid grid-cols-4 mt-2">
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
                            </div>
                            <p className="text-sm text-black/70">
                              {award.description}
                            </p>
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
                                            : (award.images as StaticImageData)
                                                .src
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
                  </>
                )}

                {user.volunteer.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-row justify-between items-center my-4">
                      <p className="text-lg text-black/70">Volunteer</p>
                    </div>
                    <div>
                      {user.volunteer
                        .sort(sortByDate)
                        .map((volunteer, index) => (
                          <div key={index} className="grid grid-cols-4 mt-2">
                            <div className="text-sm">
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
                              </div>
                              <p className="text-sm text-black/70">
                                {volunteer.description}
                              </p>
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
                                            typeof volunteer.images === "string"
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
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {user.languages.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-row justify-between items-center my-4">
                      <p className="text-lg text-black/70">Language</p>
                    </div>
                    <div>
                      {user.languages && (
                        <div>
                          {user.languages.map((language, index) => (
                            <div
                              key={index}
                              className="flex flex-row justify-between"
                            >
                              <p className={index !== 0 ? "mt-2" : ""}>
                                {language.langName} - {language.level}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Separator className="my-4" />
                <div className="flex flex-col justify-center items-center h-32 w-full">
                  <p>No posts yet.</p>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <Separator className="my-4" />
            <div className="flex flex-col justify-center items-center h-32 w-full">
              <p>Account is private.</p>
            </div>
          </>
        )}
        {user.website || user.linkedIn || user.github ? (
          <>
            <Separator className="my-4" />
            <div>
              <div className="flex flex-row justify-between items-center my-4">
                <p>Contact</p>
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
                          href={`https://linkedin.com/in/${user.linkedIn}`}
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
                          href={`https://github.com/${user.github}`}
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
          </>
        ) : null}
      </div>
    </div>
  );
}
