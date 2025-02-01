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

export const educationSchema = z.object({
  title: z
    .string()
    .regex(/^[a-zA-Z\s-]+$/, {
      message: "Title can only contain letters, spaces, and hyphens.",
    }),
  from: z.string().nonempty("Issued must be filled."),
  to: z.string().nonempty("Graduation must be filled."),
  institution: z.string().nonempty("Intitution must be filled."),
  fieldOfStudy: z.string().nonempty("Field of Study must be filled."),
  gpa: z.string().optional(),
  url: linkUrlValidation,
  description: z.string().max(150).optional(),
});
