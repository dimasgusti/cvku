"use client";

import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";

interface Profile {
  username: string;
  title: string;
  country: string;
  bio: string;
  email: string;
  image: string;
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("User not found");
    }
    return res.json();
  });

export default function UserProfile() {
  const params = useParams();
  const username = params?.username as string | undefined;

  if (!username) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>User not found.</p>
      </div>
    );
  }

  const {
    data: userData,
    error,
    isLoading,
  } = useSWR<Profile>(
    `/api/users/fetchUserByUsername?username=${username}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={32} />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    toast.error("User not found.");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>User not found.</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center">
        <img
          src={userData.image}
          alt={`${userData.username}'s profile`}
          className="rounded-full w-24 h-24 mx-auto"
        />
        <h1 className="text-2xl font-bold mt-4">{userData.username}</h1>
        <p className="text-gray-600">{userData.title}</p>
        <p className="text-gray-500 mt-2">{userData.bio}</p>
        <p className="text-sm text-gray-400 mt-4">
          {userData.country && `📍 ${userData.country}`}
        </p>
      </div>
    </div>
  );
}
