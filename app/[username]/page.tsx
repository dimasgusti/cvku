"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { Loader } from "lucide-react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import "react-photo-view/dist/react-photo-view.css";
import type { Profile } from "@/lib/interfaces";
import DefaultTemplate from "@/components/template/default";
import { motion } from "motion/react";
import MinimalistTemplate from "@/components/template/minimalist";
import SantikaTemplate from "@/components/template/santika";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col justify-center items-center py-8 md:py-4 lg:py-0 h-screen">
        <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4 pt-4 pb-16">
          <div className="py-4">
            <h2 className="text-xl md:text-2xl text-center font-semibold">
              Oops! This account doesn&apos;t exist.
            </h2>
            <h3 className="text-lg md:text-xl text-center">
              Try searching for another user or explore more profiles!
            </h3>
          </div>
          <p>Recommendation</p>
          <div className="flex flex-col gap-2">
            <div className="bg-white rounded-sm w-full min-h-10 p-2 hover:shadow transition-all duration-100 flex flex-row justify-between items-center">
              <div className="flex flex-row justify-start items-center">
                <Avatar style={{ width: 50, height: 50 }}>
                  <AvatarFallback>CV</AvatarFallback>
                </Avatar>
                <div className="flex flex-col px-2">
                  <p>Username</p>
                  <p>Title</p>
                </div>
              </div>
              <div className="text-xs">
                <Button size="sm" variant="secondary">
                  View Profile
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-sm w-full min-h-10 p-2 hover:shadow transition-all duration-100 flex flex-row justify-between items-center">
              <div className="flex flex-row justify-start items-center">
                <Avatar style={{ width: 50, height: 50 }}>
                  <AvatarFallback>CV</AvatarFallback>
                </Avatar>
                <div className="flex flex-col px-2">
                  <p>Username</p>
                  <p>Title</p>
                </div>
              </div>
              <div className="text-xs">
                <Button size="sm" variant="secondary">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const templateMap: { [key: string]: JSX.Element } = {
    basic: <DefaultTemplate user={user} />,
    minimalist: <MinimalistTemplate user={user} />,
    santika: <SantikaTemplate />,
  };

  const selectedTemplate =
    templateMap[user.template as keyof typeof templateMap] ||
    templateMap["basic"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      className="py-8 md:py-4 lg:py-0"
    >
      {selectedTemplate}
    </motion.div>
  );
}
