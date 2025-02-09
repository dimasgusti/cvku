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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { projectSchema } from "@/lib/validation/ProjectSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader, Save } from "lucide-react";
import Link from "next/link";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import { redirect } from "next/navigation";

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ItemData {
  email?: string;
  [key: string]: string | number | boolean | undefined | (string | File)[];
}

export default function AddProject() {
  const router = useRouter();
  const [charCount, setCharCount] = useState(0);
  const { data: session, status } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ongoing, setOngoing] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      fromMonth: "",
      year: "",
      company: "",
      url: "",
      description: "",
      images: [],
    },
  });

  const handleFileValidation = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
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

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setBtnLoading(true);
    try {
      const itemData: ItemData = { ...values };

      const email = session?.user?.email;

      if (!email) {
        toast.error("User is not authenticated.");
        setBtnLoading(false);
        return;
      }

      itemData.email = email;

      itemData.type = "project";

      if (values.images && values.images.length > 0) {
        const fileUrls: string[] = [];

        for (const file of values.images) {
          if (file instanceof File) {
            const isValid = handleFileValidation(file);
            if (!isValid) {
              toast.error(
                "One or more files are invalid. Please check the file size or type."
              );
              setBtnLoading(false);
              return;
            }

            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            await new Promise<void>((resolve, reject) => {
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
                  getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    fileUrls.push(url);
                    resolve();
                  });
                }
              );
            });
          } else {
            console.error("Invalid file type encountered:", file);
          }
        }

        itemData.images = fileUrls;
      }

      const response = await fetch("/api/users/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error("Failed to add project.");
      }

      toast.success("New project added successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setBtnLoading(false);
    }
  };

  const handleToChange = (value: string) => {
    if (value === "ongoing") {
      setOngoing(true);
      form.setValue("fromMonth", "January");
    } else {
      setOngoing(false);
      form.setValue("fromMonth", "");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-[30rem]">
        <Loader className="animate-spin" size={32} />
        Please wait
      </div>
    );
  }

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <div className="flex flex-row justify-center items-center py-8">
        <div className="sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Link href="/profile">
                <Button variant="outline">
                  <ArrowLeft />
                  Back to Profile
                </Button>
              </Link>
              <h2 className="text-xl md:text-2xl">Add Project</h2>
              <p>
                Your data is automatically sorted from the most recent to the
                oldest.
              </p>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input
                        disabled={btnLoading}
                        placeholder="Project Title"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year*</FormLabel>
                      <FormControl>
                        <Select
                          disabled={btnLoading}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleToChange(value);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Year (e.g., 2025)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              {Array.from(
                                { length: new Date().getFullYear() - 1975 + 1 },
                                (_, i) => {
                                  const year = new Date().getFullYear() - i;
                                  return (
                                    <SelectItem key={year} value={String(year)}>
                                      {year}
                                    </SelectItem>
                                  );
                                }
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month*</FormLabel>
                      <FormControl>
                        <Select
                          disabled={btnLoading || ongoing}
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Start Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                              ].map((month, index) => (
                                <SelectItem key={index} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        disabled={btnLoading}
                        placeholder="Project URL"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input
                        disabled={btnLoading}
                        placeholder="Company Name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={btnLoading}
                        placeholder="Brief description of the project"
                        maxLength={150}
                        {...field}
                        value={field.value}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                          const value = e.target.value;
                          setCharCount(value.length);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {charCount}/150 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Images</FormLabel>
                    <FormControl>
                      <Input
                        disabled={btnLoading}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          field.onChange(files);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Max file size: 5MB, Allowed types: Images (jpeg, png, gif)
                    </FormDescription>
                    {field.value && field.value.length > 0 && (
                      <div className="overflow-x-auto flex flex-row space-x-4 border p-1 rounded-sm">
                        {field.value.map((file, index) => {
                          if (file instanceof File) {
                            const url = URL.createObjectURL(file);
                            return (
                              <div
                                key={index}
                                className="flex-shrink-0 text-center"
                              >
                                {file.type.startsWith("image") ? (
                                  <img
                                    src={url}
                                    alt={`Preview ${index}`}
                                    className="preview-image w-32 h-32 object-cover"
                                  />
                                ) : null}
                                <p className="text-xs text-center text-ellipsis max-w-32 overflow-hidden whitespace-nowrap">
                                  {file.name}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={btnLoading}>
                {btnLoading ? (
                  <>
                    <span className="flex flex-row items-center justify-center gap-2">
                      <Loader className="animate-spin" />
                      Saving Project {Math.round(progress)}%
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
    </>
  );
}
