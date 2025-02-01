"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { Loader } from "lucide-react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Image, { StaticImageData } from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { FaGithub } from "react-icons/fa";
import { FaLink, FaLinkedinIn } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/interfaces";

countries.registerLocale(enLocale);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { username } = useParams() as { username: string };

  const getCountryName = (countryCode: string): string => {
    if (!countryCode) return "Unknown Country";

    const upperCaseCode = countryCode.toUpperCase();
    return countries.getName(upperCaseCode, "en") || "Unknown Country";
  };

  const { data: user, error } = useSWR<Profile>(
    username ? `/api/users/getUsername?username=${username}` : null,
    fetcher
  );

  const hasRecords =
    (user?.project.length ?? 0) > 0 ||
    (user?.experience?.length ?? 0) > 0 ||
    (user?.award?.length ?? 0) > 0 ||
    (user?.certification?.length ?? 0) > 0 ||
    (user?.education?.length ?? 0) > 0 ||
    (user?.volunteer?.length ?? 0) > 0;

  if (error) return <div>Error loading user data: {error.message}</div>;

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  if (!user._id) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        Not Found
      </div>
    );
  }

  return (
    <>
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
              <p className="text-sm text-black/70">
                📌 {getCountryName(user.country)}
              </p>
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

          {!user.private ? (
            <>
              {hasRecords ? (
                <>
                  {user.project.length > 0 ? (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-row justify-between items-center my-4">
                        <p className="text-lg text-black/70">Project</p>
                      </div>
                      <div>
                        {user.project.map((project, index) => (
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
                  ) : null}

                  {user.experience.length > 0 ? (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-row justify-between items-center my-4">
                        <p className="text-lg text-black/70">Work Experience</p>
                      </div>
                      <div>
                        {user.experience.map((experience, index) => (
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {user.award.length > 0 ? (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-row justify-between items-center my-4">
                        <p className="text-lg text-black/70">Award</p>
                      </div>
                      <div>
                        {user.award.map((award, index) => (
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {user.certification.length > 0 ? (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-row justify-between items-center my-4">
                        <p className="text-lg text-black/70">Certification</p>
                      </div>
                      <div>
                        {user.certification.map((certification, index) => (
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {user.education.length > 0 ? (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-row justify-between items-center my-4">
                        <p className="text-lg text-black/70">Education</p>
                      </div>
                      <div>
                        {user.education.map((education, index) => (
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {user.volunteer.length > 0 ? (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-row justify-between items-center my-4">
                        <p className="text-lg text-black/70">Volunteer</p>
                      </div>
                      <div>
                        {user.volunteer.map((volunteer, index) => (
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
                  ) : null}
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
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
