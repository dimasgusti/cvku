"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { awardSchema } from "@/lib/validation/AwardSchema";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader, Save } from "lucide-react";
import Link from "next/link";

type ProjectFormValues = z.infer<typeof awardSchema>;

interface ItemData {
  email?: string;
  [key: string]: string | number | boolean | undefined | (string | File)[];
}

export default function AddAward() {
  const router = useRouter();
  const [charCount, setCharCount] = useState(0);
  const { data: session } = useSession();
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      title: "",
      year: "",
      presentedBy: "",
      url: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof awardSchema>) => {
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

      itemData.type = "award";

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
    <div className="flex flex-row justify-center items-center py-8">
      <div className="sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Link href="/profile">
              <Button>
                <ArrowLeft />
              </Button>
            </Link>
            <h2 className="text-xl md:text-2xl">Add Award</h2>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input
                      disabled={btnLoading}
                      placeholder="Fastest Keyboard Typer"
                      {...field}
                    />
                  </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="presentedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presented by*</FormLabel>
                  <FormControl>
                    <Input
                      disabled={btnLoading}
                      placeholder="MyMom"
                      {...field}
                    />
                  </FormControl>
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
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const value = e.target.value;
                        setCharCount(value.length);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>{charCount}/150 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={btnLoading}>
              {btnLoading ? (
                <span className="flex flex-row items-center justify-center gap-2">
                  <Loader className="animate-spin" />
                  Saving Award
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
