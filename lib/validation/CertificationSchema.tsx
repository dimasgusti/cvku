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

export const certificationSchema = z.object({
  type: z.string().default("certification"),
  title: z
    .string()
    .regex(/^[a-zA-Z\s-]+$/, {
      message: "Title can only contain letters, spaces, and hyphens.",
    }),
  issued: z.string().nonempty("Issued must be filled."),
  expires: z.string().nonempty("Expires must be filled."),
  organization: z.string().nonempty("Organization must be filled."),
  url: linkUrlValidation,
  description: z.string().max(150).optional(),
});
