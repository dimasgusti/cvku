"use client";

import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long.").max(24, "Username must be at most 24 characters long").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hypens."),
    title: z.string().optional(),
    country: z.string().optional(),
    bio: z.string().max(100, "Bio must contain at most 100 character(s)").optional(),
    email: z.string().readonly(),
    image: z.string().optional(),
})