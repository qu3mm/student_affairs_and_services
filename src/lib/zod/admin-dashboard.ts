import { z } from "zod";

const categoryRelationSchema = z.object({
  name: z.string().nullable().optional(),
});

export const adminEventPayloadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  location: z.string().min(1, "Location is required."),
  category: z.string().optional().nullable(),
  image_filename: z.string().optional().nullable(),
  requirements: z.array(z.string()).optional().default([]),
});

export const adminEventSchema = adminEventPayloadSchema.extend({
  id: z.union([z.number(), z.string()]),
  category: z.array(categoryRelationSchema).optional(),
});

export type AdminEventPayload = z.infer<typeof adminEventPayloadSchema>;
export type AdminEvent = z.infer<typeof adminEventSchema>;

