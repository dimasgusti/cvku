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

export const awardSchema = z.object({
  title: z
    .string()
    .regex(/^[a-zA-Z\s-]+$/, {
      message: "Title can only contain letters, spaces, and hyphens.",
    }),
  year: z.string().nonempty("Year must be filled."),
  presentedBy: z.string().nonempty("Presented by must be filled."),
  url: linkUrlValidation,
  description: z.string().max(150).optional(),
});
