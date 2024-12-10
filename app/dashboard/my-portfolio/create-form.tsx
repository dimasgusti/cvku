"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterCountries } from "./helpers";
//@ts-ignore
import countryRegionData from "country-region-data/dist/data-umd";
import { portfolioSchema } from "@/lib/validation/portfolio-schema";

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

// const onSubmit = async (data: any) => {
//   try {
//     const response = await fetch("/api/route/portfolio/create", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     });

//     if(!response.ok){
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to create portfolio");
//     }

//     const result = await response.json();
//     console.log("Portfolio created:", result);
//     alert("Portfolio created");
//   } catch (error) {
//     alert(error || "Something went wrong");
//   }
// };

const onSubmit = async (data: any) => {
  try {
    const response = await fetch("/api/route/portfolio/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: data.fullName,
        title: data.title,
        email: data.email,
        country: data.country,
        website: data.website,
        github: data.github,
        linkedin: data.linkedin,
        twitterx: data.twitterx,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create portfolio");
    }

    const result = await response.json();
    console.log("Portfolio created:", result);
    alert("Portfolio created");
  } catch (error) {
    console.error("Error creating portfolio:", error);
  }
};

const CreatePortfolio = () => {
  const form = useForm({
    resolver: zodResolver(portfolioSchema),
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
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
