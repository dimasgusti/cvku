"use client";

import CountrySelect from "@/components/country-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { userSchema } from "@/lib/validation/UserSchema";
import { fetchData } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type UserFormValues = z.infer<typeof userSchema>;

interface Profile {
  username: string;
  title: string;
  country: string;
  bio: string;
  email: string;
  image: string;
}

export default function Settings() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const formResetRef = useRef(false);
  const [charCount, setCharCount] = useState(0);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      title: "",
      country: "",
      bio: "",
      email: "",
      image: "",
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    setBtnLoading(true);
    try {
      const response = await fetch("/api/users/updateUserByEmail", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update profile.";

        if (response.status !== 204) {
          const responseText = await response.text();
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.error || errorMessage;
            } catch (err) {
              console.error("Error parsing the error response:", err);
            }
          }
        }

        throw new Error(errorMessage);
      }
      toast.success("Profile updated!");
      router.push("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occured."
      );
    } finally {
      setBtnLoading(false);
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const userData = await fetchData(
            `/api/users/getUserByEmail?email=${session.user.email}`
          );
          setUserData(userData);

          if (!formResetRef.current) {
            form.reset({
              username: userData.username || "",
              title: userData.title || "",
              country: userData.country || "",
              bio: userData.bio || "",
              email: userData.email || "",
              image: userData.image || "",
            });
            formResetRef.current = true;
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session?.user?.email, form]);

  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full wsm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">cvku.id/</span>
                      <Input
                        {...field}
                        value={field.value || ""}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const value = e.target.value;
                        setCharCount(value.length);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {charCount > 100 ? (
                      <span className="text-red-500">{charCount} / 100</span>
                    ) : (
                      <span>{charCount} / 100</span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <CountrySelect {...field} className="flex-1" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={btnLoading}>
              {btnLoading ? (
                <span className="flex flex-row items-center justify-center gap-2">
                  <Loader className="animate-spin" />
                  Saving User
                </span>
              ) : (
                <span className="flex flex-row justify-center items-center gap-2">
                  <Save />
                  Save
                </span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
