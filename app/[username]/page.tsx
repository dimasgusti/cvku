"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { Loader } from "lucide-react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Image, { StaticImageData } from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import { FaGithub } from "react-icons/fa";
import { FaLink, FaLinkedinIn } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";

countries.registerLocale(enLocale);

interface Profile {
  _id: string;
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

export default function Page() {
  const { username } = useParams() as { username: string };

  const getCountryName = (countryCode: string): string => {
    if (!countryCode) return "Unknown Country";

    const upperCaseCode = countryCode.toUpperCase();
    return countries.getName(upperCaseCode, "en") || "Unknown Country";
  };

  const { data: userData, error } = useSWR<Profile>(
    username ? `/api/users/getUserByUsername?username=${username}` : null,
    fetcher
  );

  const { data: fetchedRecordData } = useSWR<Record[]>(
    userData?._id ? `/api/records/getRecord?userId=${userData._id}` : null,
    fetcher
  );

  const [recordData, setRecordData] = useState<Record[]>([]);

  useEffect(() => {
    if (fetchedRecordData) {
      setRecordData(fetchedRecordData);
    }
  }, [fetchedRecordData]);

  if (error) return <div>Error loading user data.</div>;

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

  if (!userData || !recordData.length) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-center items-center">
        <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 pt-4 pb-8">
          <div className="flex flex-row justify-start w-full items-center gap-4 py-4">
            <Image
              src={userData.image}
              width={100}
              height={100}
              alt={`${userData.username} Profile Picture`}
              className="rounded-full"
              priority
            />
            <div className="flex flex-col">
              <p className="text-lg text-black/90">
                {userData?.username} <br />
              </p>
              {userData.title ? (
                <p className="text-sm text-black/70">💼 {userData.title}</p>
              ) : null}
              <p className="text-sm text-black/70">
                📌 {getCountryName(userData.country)}
              </p>
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

          {projects.length > 0 ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-row justify-between items-center my-4">
                <p className="text-lg text-black/70">Project</p>
              </div>
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
                                      alt={`Image ${userData.username} ${index}`}
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
                                    alt={`Image ${userData.username}`}
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

          {workplace.length > 0 ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-row justify-between items-center my-4">
                <p className="text-lg text-black/70">Work Experience</p>
              </div>
              <div>
                {workplace.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 mt-2">
                    <p className="text-sm">
                      {new Date(`${record.fromMonth} 1`).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                        }
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
                      </div>
                      <p className="text-sm text-black/70">
                        {record.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {awards.length > 0 ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-row justify-between items-center my-4">
                <p className="text-lg text-black/70">Award</p>
              </div>
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
                      </div>
                      <p className="text-sm text-black/70">
                        {record.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {certifications.length > 0 ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-row justify-between items-center my-4">
                <p className="text-lg text-black/70">Certification</p>
              </div>
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
                      </div>
                      <p className="text-sm text-black/70">
                        {record.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {educations.length > 0 ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-row justify-between items-center my-4">
                <p className="text-lg text-black/70">Education</p>
              </div>
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
            </>
          ) : null}

          {volunteers.length > 0 ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-row justify-between items-center my-4">
                <p className="text-lg text-black/70">Volunteer</p>
              </div>
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
                                      alt={`Image ${userData.username} ${index}`}
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
                                    alt={`Image ${userData.username}`}
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

          {userData.website || userData.linkedIn || userData.github ? (
            <>
              <Separator className="my-4" />
              <div>
                <div className="flex flex-row justify-between items-center my-4">
                  <p>Contact</p>
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
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
