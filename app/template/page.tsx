"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { userSchema } from "@/lib/validation/UserSchema";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function TemplatePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);

  async function onUpdate(values: z.infer<typeof userSchema>) {
    setBtnLoading(true);
    if (!session?.user?.email) {
      toast.error("Please sign in to update template.");
      return;
    }
    try {
      const response = await fetch("/api/users/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      toast.success("Template updated!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setBtnLoading(false);
    }
  }

  const templates = [
    {
      id: 1,
      name: "Basic (Free)",
      description: "Tampilan bersih dan elegan untuk kesan profesional.",
      image: "/template/basic.jpeg",
      previewUrl: "https://cvku.vercel.app/dimasgusti",
    },
    {
      id: 2,
      name: "Minimalist (Free)",
      description: "Desain modern dengan warna kontras yang menarik.",
      image: "/template/minimalist.jpeg",
      previewUrl: "https://cvku.vercel.app/dimasgusti",
    },
  ];

  return (
    <div className="h-screen w-full flex flex-col justify-center items-start p-4">
      <h1 className="text-3xl md:text-4xl font-semibold font-serif">
        Browse Template
      </h1>
      <div className="flex flex-col md:w-2/3 lg:w-1/3 mb-4">
        <p>
          Browse through our collection, find the perfect template for your
          style, and start personalizing it to match your experience and skills.
        </p>
        <p>
          Get inspired, choose your template, and begin building a CV that will
          make a lasting impression.
        </p>
      </div>
    </div>
  );
}
