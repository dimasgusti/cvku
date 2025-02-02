"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { Loader } from "lucide-react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import "react-photo-view/dist/react-photo-view.css";
import type { Profile } from "@/lib/interfaces";
import DefaultTemplate from "@/components/template/default";

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

  const templateMap: { [key: string]: JSX.Element } = {
    basic: <DefaultTemplate user={user} />,
  };

  const selectedTemplate =
    templateMap[user.template as keyof typeof templateMap] ||
    templateMap["basic"];

  return <>{selectedTemplate}</>;
}