"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languageSchema } from "@/lib/validation/LanguageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type LanguageFormValues = z.infer<typeof languageSchema>;

interface Language {
  email?: string;
  langName: string;
  level: string;
}

export default function Language() {
  const [btnLoading, setBtnLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      langName: "",
      level: "Beginner",
    },
  });

  const onSubmit = async (values: LanguageFormValues) => {
    setBtnLoading(true);
    try {
      if (!session?.user?.email) {
        toast.error("User is not authenticated.");
        setBtnLoading(false);
        return;
      }

      const languageData: Language = {
        email: session.user.email,
        langName: values.langName,
        level: values.level,
      };

      const response = await fetch("/api/users/addLanguage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(languageData),
      });

      if (!response.ok) throw new Error("Failed to add language");

      toast.success("Language added successfully!");
      redirect("/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occured."
      );
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full sm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4 pb-16"
          >
            <Link href="/profile">
              <Button variant="outline" type="button">
                <ArrowLeft />
              </Button>
            </Link>
            <h2 className="text-xl md:text-2xl">Add Language</h2>

            <FormField
              control={form.control}
              name="langName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={btnLoading}
                      placeholder="Language Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency Level</FormLabel>
                  <FormControl>
                    <Select
                      disabled={btnLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={btnLoading}>
              {btnLoading ? (
                <span className="flex flex-row items-center justify-center gap-2">
                  <Loader className="animate-spin" />
                  Saving Language
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
