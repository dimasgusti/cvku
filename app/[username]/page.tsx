"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
  const params = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (params?.username) {
        try {
          const response = await fetch(`/api/users/getUsersByUsername?name=${params.username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          setUserData(data);  // Set the fetched user data
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUserData();
  }, [params?.username]);  // Run the effect when the username changes

  return (
    <div>
        {userData}
    </div>
  );
}