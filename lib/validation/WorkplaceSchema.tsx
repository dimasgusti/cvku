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

export const workplaceSchema = z.object({
  type: z.string().default("project"),
  title: z
    .string()
    .regex(/^[a-zA-Z\s-]+$/, {
      message: "Title can only contain letters, spaces, and hyphens.",
    }),
  from: z.string().nonempty("Year must be filled."),
  to: z.string().nonempty("Year must be filled."),
  company: z.string().nonempty("Company must be filled."),
  location: z.string().nonempty("Location must be filled"),
  url: linkUrlValidation,
  description: z.string().max(150).optional(),
});
