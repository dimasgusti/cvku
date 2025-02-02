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
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader, Save } from "lucide-react";
import Link from "next/link";
import { educationSchema } from "@/lib/validation/EduSchema";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebaseConfig";

type EducationFormValues = z.infer<typeof educationSchema>;

interface ItemData {
  email?: string;
  [key: string]: string | number | boolean | undefined | (string | File)[];
}

export default function AddEducation() {
  const router = useRouter();
  const [charCount, setCharCount] = useState(0);
  const { data: session, status } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      title: "",
      from: "",
      to: "",
      institution: "",
      fieldOfStudy: "",
      gpa: "",
      url: "",
      description: "",
      images: [],
    },
  });

  const handleFileValidation = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB!");
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only images (jpeg, png, gif) allowed.");
      return false;
    }
    return true;
  };

  const onSubmit = async (values: z.infer<typeof educationSchema>) => {
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

      itemData.type = "education";

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

  if (status === 'loading') {
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
                <Button>
                  <ArrowLeft />
                </Button>
              </Link>
              <h2 className="text-xl md:text-2xl">Add Education</h2>
              <p>
                Your data is automatically sorted from the most recent to the
                oldest.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree/Program Title*</FormLabel>
                      <FormControl>
                        <Input
                          disabled={btnLoading}
                          placeholder="Judul Gelar/Program"
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
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          disabled={btnLoading}
                          placeholder="Institution URL"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issued*</FormLabel>
                      <FormControl>
                        <Select
                          disabled={btnLoading}
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Start Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
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
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduated*</FormLabel>
                      <FormControl>
                        <Select
                          disabled={btnLoading}
                          onValueChange={(value) => {
                            // Get the value from "from" field and compare with "to"
                            const fromYear = form.getValues("from");
                            if (
                              fromYear &&
                              parseInt(value) < parseInt(fromYear)
                            ) {
                              // Show error if "to" year is less than "from" year
                              form.setError("to", {
                                type: "manual",
                                message:
                                  "End year cannot be earlier than start year",
                              });
                            } else {
                              form.clearErrors("to");
                              field.onChange(value);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-fit">
                            <SelectValue placeholder="End Year (or expected)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Array.from(
                                { length: 2035 - 1975 + 1 },
                                (_, i) => {
                                  const year = 2050 - i;
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
              </div>
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intitution*</FormLabel>
                    <FormControl>
                      <Input
                        disabled={btnLoading}
                        placeholder="Institution Name"
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
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study*</FormLabel>
                    <FormControl>
                      <Input
                        disabled={btnLoading}
                        placeholder="(e.g., Computer Science)"
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
                name="gpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA</FormLabel>
                    <FormControl>
                      <Input
                        disabled={btnLoading}
                        placeholder="GPA"
                        type="number"
                        max={4}
                        step="0.1"
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
                        placeholder="Program details and key learnings"
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
                  <span className="flex flex-row items-center justify-center gap-2">
                    <Loader className="animate-spin" />
                    Saving Education {Math.round(progress)}%
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
    </>
  );
}
