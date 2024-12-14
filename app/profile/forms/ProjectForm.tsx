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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/lib/validation/ProjectSchema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useSession } from "next-auth/react";

type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = {
  onProjectAdded: () => void;
};

export default function ProjectForm({
  onProjectAdded,
}: ProjectFormProps) {
  const { data: session, status } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      company: "",
      description: "",
      link: "",
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      setDialogOpen(false);
      onProjectAdded();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild className="hover:underline hover:cursor-pointer">
        <button
          className="flex flex-row text-sm items-center gap-1"
          onClick={() => setDialogOpen(true)}
        >
          <FaPlus size={10} />
          Add Project
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] md:max-w-[540px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Keyboard Typer" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From*</FormLabel>
                    <FormControl>
                      <Input type="month" className="w-fit" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input type="month" className="w-fit" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="MyMom" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                const [charCount, setCharCount] = useState(0);

                const handleChange = (e: any) => {
                  const value = e.target.value;
                  setCharCount(value.length);
                  field.onChange(e);
                };

                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project in all its glory!"
                        maxLength={150}
                        {...field}
                        value={field.value}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {charCount}/150 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
