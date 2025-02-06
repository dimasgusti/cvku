"use client";

import { z } from "zod";

export const languageSchema = z.object({
    langName: z.string().min(1, "Language name is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced", "Fluent", "Native"]),
})