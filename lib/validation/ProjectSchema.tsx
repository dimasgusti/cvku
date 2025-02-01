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
  title: z.string().regex(/^[a-zA-Z0-9\s-]+$/, {
    message: "Title can only contain letters, spaces, and hyphens.",
  }),
  fromMonth: z.string().nonempty("Month must be filled."),
  year: z.string().nonempty("Year must be filled."),
  company: z.string().optional(),
  url: linkUrlValidation,
  description: z.string().max(150).optional(),
  images: z.array(z.union([z.instanceof(File), z.string()])).optional(),
});
