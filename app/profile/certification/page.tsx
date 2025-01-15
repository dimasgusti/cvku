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
import { useRouter } from "next/navigation";
import { certificationSchema } from "@/lib/validation/CertificationSchema";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader, Save } from "lucide-react";
import Link from "next/link";

type ProjectFormValues = z.infer<typeof certificationSchema>;

export default function AddProject() {
  const router = useRouter();
  const [charCount, setCharCount] = useState(0);
  const { data: session } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      type: "certification",
      title: "",
      issued: "",
      expires: "",
      organization: "",
      url: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof certificationSchema>) {
    setBtnLoading(true);
    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        let errorMessage = "Failed to add the award.";

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
      toast.success("New project added successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occured."
      );
    }
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>
          Please{" "}
          <Link href="/auth/signin" className="underline">
            log in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-center items-center py-8">
        <div className="sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Link href="/profile">
                <Button>
                  <ArrowLeft />
                </Button>
              </Link>
              <h2 className="text-xl md:text-2xl">Add Project</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="iOS Swift UI" {...field} />
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
                        <Input {...field} />
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
                  name="issued"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issued*</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Select a year" />
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
                  name="expires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires*</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Select a year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="doesNotExpire">
                                Does not expire
                              </SelectItem>
                              {Array.from(
                                { length: 2050 - 1975 + 1 },
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
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization*</FormLabel>
                    <FormControl>
                      <Input placeholder="Coursera" {...field} />
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
                        placeholder="Describe your project in all its glory!"
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
              <Button type="submit" disabled={btnLoading}>
                {btnLoading ? (
                  <span className="flex flex-row items-center justify-center gap-2">
                    <Loader className="animate-spin" />
                    Saving Certification
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
