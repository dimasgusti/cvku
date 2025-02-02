"use client";

import { z } from "zod";

const linkUrlValidation = z
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
      message: "Invalid URL format",
    }
  );

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(24, "Username must be at most 24 characters long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens."
    ),
  title: z.string().optional(),
  country: z.string().min(1),
  bio: z
    .string()
    .max(100, "Bio must contain at most 100 character(s)")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  website: linkUrlValidation,
  linkedIn: linkUrlValidation,
  github: linkUrlValidation,
  private: z.boolean().default(true),
  template: z.string().default('basic'),
  viewCount: z.number().default(0),
});
