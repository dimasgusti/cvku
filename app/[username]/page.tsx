"use client";

import useSWR from "swr";
import { use } from "react";
import Image from "next/image";

type Params = {
  username: string;
};

interface Profile {
  username: string;
  title: string;
  country: string;
  bio: string;
  email: string;
  image: string;
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
  to: string;
  url: string;
  company: string;
  organization: string;
  location: string;
  presentedBy: string;
  description: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProfilePage({ params }: { params: Promise<Params> }) {
  const unwrappedParams = use(params);
  const { username } = unwrappedParams;

  const { data: userData, error } = useSWR<Profile>(
    `/api/users/fetchUserByUsername?username=${username}`,
    fetcher
  );

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <p>Error fetching user data.</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <div className="flex flex-col items-center text-center space-y-4">
        <Image
          src={userData.image}
          width={100}
          height={100}
          alt={userData.username}
          className="rounded-full border-4 border-blue-500"
          priority
        />
        <h1 className="text-3xl font-semibold text-gray-800">
          {userData.username}
        </h1>
        <p className="text-xl text-gray-600">{userData.title}</p>
        <p className="text-md text-gray-500">{userData.country}</p>
        <p className="text-md text-gray-500">{userData.bio}</p>
        <p className="text-sm text-gray-400">{userData.email}</p>
      </div>
    </div>
  );
}
