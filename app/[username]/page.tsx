"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { Loader } from "lucide-react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import "react-photo-view/dist/react-photo-view.css";
import type { Profile } from "@/lib/interfaces";
import DefaultTemplate from "@/components/template/default";
import { motion } from "motion/react"
import MinimalistTemplate from "@/components/template/minimalist";

countries.registerLocale(enLocale);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { username } = useParams() as { username: string };

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
    minimalist: <MinimalistTemplate user={user} />
  };

  const selectedTemplate =
    templateMap[user.template as keyof typeof templateMap] ||
    templateMap["basic"];

  return(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
    >
      {selectedTemplate}
    </motion.div>
  );
}