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

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(32, { message: "Title must be at most 32 characters long." })
    .regex(/^[a-zA-Z\s-]+$/, {
      message: "Title can only contain letters, spaces, and hyphens.",
    }),
  startDate: z.string(),
  endDate: z.string().optional(),
  company: z.string().optional(),
  description: z.string().max(150).optional(),
  link: linkUrlValidation,
});
