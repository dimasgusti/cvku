"use client";

import { z } from "zod";

export const skillSchema = z.object({
  skills: z.array(z.string().min(1, "Skill is required")).optional(),
});