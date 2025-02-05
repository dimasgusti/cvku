"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { skillSchema } from "@/lib/validation/SkillSchema";
import { fetchData } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type SkillFormValues = z.infer<typeof skillSchema>;

interface Skill {
  email?: string;
  skills?: string[];
}

export default function SkillForm() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const formResetRef = useRef(false);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: [],
    },
  });

  const onSubmit = async (values: SkillFormValues) => {
    setBtnLoading(true);
    try {
      if (!session?.user?.email) {
        toast.error("User is not authenticated.");
        setBtnLoading(false);
        return;
      }

      const skillData: Skill = {
        email: session.user.email,
        skills: values.skills,
      };

      const response = await fetch("/api/users/addSkill", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) throw new Error("Failed to update skills");

      toast.success("Skills updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const fetchSkillData = async () => {
      if (session?.user?.email) {
        try {
          const skillData = await fetchData(
            `/api/users/getUser?email=${session.user.email}`
          );

          if (!formResetRef.current) {
            form.reset({
              skills: skillData.skills || [],
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

    fetchSkillData();
  }, [session?.user?.email]);

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
            <h2 className="text-xl md:text-2xl">Update Skill</h2>

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <div>
                      <div className="py-1 flex flex-wrap gap-2 mb-2">
                        {field.value?.map((skill, index) => (
                          <div
                            key={index}
                            className="flex flex-row gap-1 items-center bg-gray-100 w-fit px-3 py-1"
                          >
                            <span>{skill}</span>
                            <X
                              className="hover:cursor-pointer"
                              size={16}
                              color="red"
                              onClick={() => {
                                const updatedSkills = (
                                  field.value || []
                                ).filter((_, i) => i !== index);
                                field.onChange(updatedSkills);
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <Textarea
                        {...field}
                        value={loading ? "Loading..." : field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map((s) => s.trim())
                          )
                        }
                        disabled={loading}
                        placeholder="Enter skills"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Separate skills using commas (e.g., JavaScript, React,
                    Node.js)
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={btnLoading}>
              {btnLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
