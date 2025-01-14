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

  const emailValidation = z
  .string()
  .email("Invalid email format") 
  .min(5, "Email is too short")  
  .max(255, "Email is too long")
  .optional();

export const contactSchema = z.object({
  type: z.string().default("contact"),
  email: emailValidation,
  website: linkUrlValidation,
  linkedIn: linkUrlValidation,
  github: linkUrlValidation,
});
