import { z } from "zod";

const fileItemSchema = z.custom<File>(
  (value) => {
    if (typeof File === "undefined") {
      return true;
    }

    return value instanceof File;
  },
  {
    message: "Invalid file upload",
  }
);

export const addEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  submissionDate: z.date(),
  username: z.string().min(1, "Username is required"),
  category: z.string().min(1, "Please select a category"),
  requirements: z.array(z.string().min(1)).min(1, "Add at least one requirement"),
  attachments: z
    .array(fileItemSchema)
    .max(5, "You can upload up to five files only")
    .optional(),
});

export type AddEventFormValues = z.infer<typeof addEventSchema>;