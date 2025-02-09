"use client";

import CountrySelect from "@/components/country-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { storage } from "@/firebaseConfig";
import { userSchema } from "@/lib/validation/UserSchema";
import { fetchData } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
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
  website: string;
  linkedIn: string;
  github: string;
  private: boolean;
  template: string;
}

export default function Settings() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const formResetRef = useRef(false);
  const [charCount, setCharCount] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      template: "",
      title: "",
      country: "",
      bio: "",
      email: "",
      image: "",
      website: "",
      linkedIn: "",
      github: "",
      private: true,
    },
  });

  const handleFileValidation = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB!");
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only (jpg, jpeg, png, gif) allowed.");
      return false;
    }
    return true;
  };

  async function onSubmit(values: z.infer<typeof userSchema>) {
    setBtnLoading(true);
    values.username = values.username.trim().toLowerCase();

    if (
      values.image &&
      typeof values.image !== "string" &&
      (values.image as File) instanceof File
    ) {
      const imageFile = values.image as File;
      const isValid = handleFileValidation(imageFile);
      if (!isValid) {
        toast.error("Invalid file. Please check the file size or type.");
        setBtnLoading(false);
        return;
      }

      const storageRef = ref(storage, `uploads/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      try {
        const imageUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(progress);
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then(resolve)
                .catch(reject);
            }
          );
        });

        values.image = imageUrl;
      } catch (error) {
        console.log("Image upload failed:", error);
        toast.error("Image upload failed. Please try again.");
        setBtnLoading(false);
        return;
      }
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

      toast.success("Profile updated!");
      router.push("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
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
            `/api/users/getUser?email=${session.user.email}`
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
              website: userData.website || "",
              linkedIn: userData.linkedIn || "",
              github: userData.github || "",
              private: userData.private ?? true,
              template: userData.template || "",
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

  if (status === 'loading') {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4 pb-16"
          >
            <Link href="/profile">
                <Button variant='outline'>
                  <ArrowLeft />
                  Back to Profile
                </Button>
              </Link>
            <h2 className="text-xl md:text-2xl">Update Profile</h2>
            <Avatar style={{ width: 100, height: 100 }}>
              <AvatarImage
                src={previewImage || userData?.image || "/Logo.svg"}
                alt={userData?.username || "Guest"}
              />
              <AvatarFallback>CV</AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <Input
                      disabled={btnLoading}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          setPreviewImage(imageUrl);
                        }
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Max file size: 5MB, Allowed types: Images (jpeg, png, gif)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>Username*</FormLabel>
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
                    {charCount > 300 ? (
                      <span className="text-red-500">{charCount} / 300</span>
                    ) : (
                      <span>{charCount} / 300</span>
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
                  <FormLabel>Country*</FormLabel>
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
            <h2 className="text-xl md:text-2xl">Contact Information</h2>
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={loading ? "Loading..." : field.value || ""}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={loading ? "Loading..." : field.value || ""}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={loading ? "Loading..." : field.value || ""}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h2 className="text-xl md:text-2xl">Privacy Control</h2>
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
                    {field.value ? "Private Account" : "Public Account"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={btnLoading}>
              {btnLoading ? (
                <>
                  <span className="flex flex-row items-center justify-center gap-2">
                    <Loader className="animate-spin" />
                    Saving User {progress}%
                  </span>
                </>
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
