"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { contactSchema } from "@/lib/validation/ContactSchema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader, Save } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const formResetRef = useRef(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      website: "",
      linkedIn: "",
      github: "",
    },
  });

  useEffect(() => {
    const fetchContactData = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(
            `/api/records/getRecordById?userId=${session.user.id}`
          );
          const contactData = await res.json();

          if (contactData && contactData.length > 0) {
            const contact = contactData.find(
              (item: any) => item.type === "contact"
            );
            if (contact && !formResetRef.current) {
              form.reset({
                email: contact.email || "",
                website: contact.website || "",
                linkedIn: contact.linkedIn || "",
                github: contact.github || "",
              });
              formResetRef.current = true;
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContactData();
  }, [session?.user?.id, form]);

  const onSubmit = async (values: ContactFormValues) => {
    setBtnLoading(true);
    console.log("Hello");
    setBtnLoading(false);
  };

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="w-full wsm:w-[360px] md:w-[420px] lg:w-[640px] min-h-96 px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <Link href="/profile">
              <Button variant="outline">
                <ArrowLeft />
              </Button>
            </Link>
            <h2 className="text-xl md:text-2xl">Update Contact Info</h2>

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
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>LinkedIn</FormLabel>
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
                  <FormLabel>GitHub</FormLabel>
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

            <Button type="submit" disabled={btnLoading}>
              {btnLoading ? (
                <span className="flex flex-row items-center justify-center gap-2">
                  <Loader className="animate-spin" />
                  Saving Contact Info
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
