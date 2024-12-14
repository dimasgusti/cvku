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
  startDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Date from required",
  }),
  endDate: z.string(),
  company: z.string().optional(),
  description: z.string().max(150).optional(),
  link: linkUrlValidation,
})
.refine((data) => {
  if (data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    return false;
  }
  return true;
}, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});