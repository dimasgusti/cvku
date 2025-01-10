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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { userSchema } from "@/lib/validation/UserSchema";
import { fetchData } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
  private: boolean;
}

export default function Settings() {
  const router = useRouter();
  const { data: session } = useSession();
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
      private: true,
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    setBtnLoading(true);
    if (values.username !== userData?.username) {
      try {
        const usernameResponse = await fetch(
          `/api/users/getUserByUsername?username=${values.username}`
        );
        const usernameData = await usernameResponse.json();

        if (usernameData.exists) {
          toast.error("Username is already taken. Please choose another.");
          setBtnLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        toast.error("Error checking username.");
        setBtnLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/users/updateUserByEmail", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile.");
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
              private: userData.private ?? true,
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

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full wsm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <Link href="/profile">
              <Button variant="outline">
                <ArrowLeft />
              </Button>
            </Link>
            {userData?.username ? (
              <h2 className="text-xl md:text-2xl">Update Profile</h2>
            ) : (
              <h2 className="text-xl md:text-2xl">Update Profile</h2>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={loading ? "Loading..." : field.value || ""}
                      className={loading ? "opacity-50 cursor-not-allowed" : ""}
                      disabled
                    />
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
                        value={loading ? "Loading..." : field.value || ""}
                        disabled={loading}
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
                    <Input
                      {...field}
                      value={loading ? "Loading..." : field.value || ""}
                      disabled={loading}
                    />
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
                      value={loading ? "Loading..." : field.value || ""}
                      disabled={loading}
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
                    <CountrySelect
                      {...field}
                      value={loading ? "Loading..." : field.value || ""}
                      className="flex-1"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="private"
              render={({ field }) => (
                <FormItem className="flex flex-row justify-start items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                  <FormDescription className="pb-2">
                    {field.value ? "Private" : "Public"}
                  </FormDescription>
                  <FormMessage />
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
