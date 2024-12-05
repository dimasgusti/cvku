"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterCountries } from "./helpers";
//@ts-ignore
import countryRegionData from "country-region-data/dist/data-umd";
import { getSession } from "next-auth/react";

const formSchema = z.object({
  fullName: z
    .string()
    .min(4, { message: "Full name must be at least 4 characters." })
    .max(32, { message: "Full name must be at most 32 characters long." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Full name can only contain letters and spaces.",
    }),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(50, { message: "Title must be at most 50 characters long." })
    .regex(/^[a-zA-Z\s-]+$/, {
      message: "Title can only contain letters, spaces, and hyphens.",
    }),
  email: z.string().email(),
  country: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Passes if it's undefined or empty
        try {
          new URL(val); // Check if it's a valid URL
          return true;
        } catch {
          return false; // Invalid URL
        }
      },
      {
        message: "Invalid URL",
      }
    ),
  github: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid URL",
      }
    ),
  linkedin: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid URL",
      }
    ),
  twitterx: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid URL",
      }
    ),
});

export interface Region {
  name: string;
  shortCode: string;
}

export interface CountryRegion {
  countryName: string;
  countryShortCode: string;
  regions: Region[];
}

interface CountrySelectProps {
  priorityOptions?: string[];
  whitelist?: string[];
  blacklist?: string[];
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

function CountrySelect({
  priorityOptions = ["ID"],
  whitelist = [],
  blacklist = ["IL", "KP", "IR", "SY", "CU", "SD", "AF", "VE", "SO", "YE"],
  onChange = () => {},
  className,
  placeholder = "Country",
}: CountrySelectProps) {
  const [countries, setCountries] = useState<CountryRegion[]>([]);

  useEffect(() => {
    setCountries(
      filterCountries(countryRegionData, priorityOptions, whitelist, blacklist)
    );
  }, []);

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {countries.map(({ countryName, countryShortCode }) => (
          <SelectItem key={countryShortCode} value={countryShortCode}>
            {countryName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const CreatePortfolio = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      title: "",
      email: "",
      country: "",
      website: "",
      github: "",
      linkedin: "",
      twitterx: "",
    },
  });

  return (
    <div className="w-[360px]">
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormDescription>
                  This name will be publicly displayed on your portfolio.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your job title or position"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This title will be shown on your portfolio.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormDescription>
                  This email will be used for contact purposes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country (optional)</FormLabel>
                <FormControl>
                  <CountrySelect
                    onChange={(value) => field.onChange(value)}
                    className="w-full"
                    placeholder="Select your country"
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
                <FormLabel className="flex flex-row gap-1">
                  Website<span className="text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://yoursite.com" {...field} />
                </FormControl>
                <FormDescription>
                  This is the URL to your personal website or portfolio.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex flex-row gap-1">
                  Github<span className="text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/yourname" {...field} />
                </FormControl>
                <FormDescription>
                  Share your Github profile link here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex flex-row gap-1">
                  LinkedIn<span className="text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/id/yourname"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Share your LinkedIn profile link here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitterx"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex flex-row gap-1">
                  X (Twitter)<span className="text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://x.com/yourname" {...field} />
                </FormControl>
                <FormDescription>
                  Share your X (formerly Twitter) profile link here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreatePortfolio;
