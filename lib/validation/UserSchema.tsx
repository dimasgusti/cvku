"use client";

import { z } from "zod";

export const userSchema = z.object({
    username: z.string().optional(),
    title: z.string().optional(),
    country: z.string().optional(),
    bio: z.string().optional(),
    email: z.string().readonly(),
    image: z.string().optional(),
})