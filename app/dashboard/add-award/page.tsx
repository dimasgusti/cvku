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

type ProjectFormValues = z.infer<typeof awardSchema>;

export default function AddProject() {
  const router = useRouter();
  const [charCount, setCharCount] = useState(0); // Pindahkan useState ke tingkat atas
  const { data: session } = useSession();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      type: "award",
      title: "",
      year: "",
      presentedBy: "",
      url: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof awardSchema>) {
    toast("Submitting new award...");
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

      toast.success("New award added successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex flex-row justify-center items-center py-8">
      <div className="sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Fastest Keyboard Typer" {...field} />
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
                      <Input {...field} />
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
                    <Input placeholder="MyMom" {...field} />
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
