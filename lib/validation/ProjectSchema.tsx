"use client";

import { z } from "zod";

const socialUrlValidation = z
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

export const ProjectSchema = z.object({
  title: z.string().min(3).max(32),
  startDate: z.string(),
  endDate: z.string().optional(),
  company: z.string().optional(),
  description: z.string().optional(),
  link: socialUrlValidation,
  attachment: z.string().optional(),
});
