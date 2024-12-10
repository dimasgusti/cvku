import { z } from 'zod';

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

export const portfolioSchema = z.object({
  fullName: z
    .string()
    .min(4, { message: "Full name must be at least 4 characters." })
    .max(32, { message: "Full name must be at most 32 characters long." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Full name can only contain letters and spaces.",
    }),

  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(50, { message: "Title must be at most 50 characters long." })
    .regex(/^[a-zA-Z\s-]+$/, {
      message: "Title can only contain letters, spaces, and hyphens.",
    }),

  email: z
    .string()
    .email({ message: "Please provide a valid email address." }),

  country: z
    .string()
    .optional(),

  github: socialUrlValidation,
  linkedin: socialUrlValidation,
  twitterx: socialUrlValidation,
  website: socialUrlValidation,

  projects: z
    .array(
      z.object({
        title: z
          .string()
          .min(3, { message: "Project title must be at least 3 characters." })
          .max(100, { message: "Project title must be at most 100 characters." })
          .regex(/^[a-zA-Z0-9\s\-]+$/, {
            message: "Project title can only contain letters, numbers, spaces, and hyphens.",
          }),

        description: z
          .string()
          .min(10, { message: "Project description must be at least 10 characters." })
          .max(500, { message: "Project description must be at most 500 characters." }),

        link: z
          .string()
          .url({ message: "Provide a valid project link." })
          .optional(),
      })
    )
    .optional(),

  awards: z
    .array(
      z.object({
        title: z
          .string()
          .min(3, { message: "Award title must be at least 3 characters." })
          .max(100, { message: "Award title must be at most 100 characters." }),

        description: z
          .string()
          .min(10, { message: "Award description must be at least 10 characters." })
          .max(500, { message: "Award description must be at most 500 characters." }),

        date: z
          .date()
          .refine(
            (val) => val <= new Date(),
            { message: "Award date cannot be in the future." }
          ),
      })
    )
    .optional(),

  skills: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, { message: "Skill name must be at least 2 characters." })
          .max(50, { message: "Skill name must be at most 50 characters." }),

        proficiency: z
          .string()
          .min(1, { message: "Proficiency must be specified." })
          .max(20, { message: "Proficiency level must be at most 20 characters." }),
      })
    )
    .optional(),
});