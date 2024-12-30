"use client";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { userSchema } from "@/lib/validation/UserSchema";
import { Textarea } from "@/components/ui/textarea";

type UserFormValues = z.infer<typeof userSchema>;

interface Profile {
  username: string;
  title: string;
  country: string;
  bio: string;
  email: string;
  image: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchUsers = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(
          `/api/users/getUserByEmail?email=${session.user.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch records.");
        }

        const data = await response.json();
        setUserData(data);
        form.reset({
          username: data.username,
          title: data.title,
          country: data.country,
          bio: data.bio,
          email: data.email,
          image: data.image,
        });
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [session?.user?.id]);

  async function onSubmit(values: z.infer<typeof userSchema>) {
    toast("Updating profile...");
    console.log(values);
  }

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (status === "loading" || loading) {
    return <h1>Loading...</h1>;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <>
      <div className="flex flex-row justify-center items-center py-8">
        <div className="sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      {/* Ensure value is controlled */}
                      <Input
                        {...field}
                        value={field.value || ""}  
                      />
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
                        value={field.value || ""}  
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
                        value={field.value || ""}  
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}