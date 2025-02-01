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
import { certificationSchema } from "@/lib/validation/CertificationSchema";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader, Save } from "lucide-react";
import Link from "next/link";

type ProjectFormValues = z.infer<typeof certificationSchema>;

export default function AddCertification() {
  const router = useRouter();
  const [charCount, setCharCount] = useState(0);
  const { data: session } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: "",
      issued: "",
      expires: "",
      organization: "",
      url: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof certificationSchema>) => {
    setBtnLoading(true);
    try {
      const itemData = { ...values } as { email?: string; [key: string]: any };

      const email = session?.user?.email;

      if (!email) {
        toast.error("User is not authenticated.");
        setBtnLoading(false);
        return;
      }

      itemData.email = email;

      itemData.type = "certification";

      console.log("Experience Data:", itemData);

      const response = await fetch("/api/users/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error("Failed to add award.");
      }

      toast.success("New award added successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setBtnLoading(false);
    }
  };

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
              <h2 className="text-xl md:text-2xl">Add Project</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input
                          disabled={btnLoading}
                          placeholder="iOS Swift UI"
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
                        <Input disabled={btnLoading} {...field} />
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
                          disabled={btnLoading}
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
                          disabled={btnLoading}
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
                      <Input
                        disabled={btnLoading}
                        placeholder="Coursera"
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
