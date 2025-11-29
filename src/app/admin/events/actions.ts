"use server";

import { revalidatePath } from "next/cache";

import {
  adminEventPayloadSchema,
  adminEventSchema,
  type AdminEvent,
  type AdminEventPayload,
} from "@/lib/zod/admin-dashboard";
import { createClient } from "@/utils/supabase/server";

const ADMIN_PATHS_TO_REVALIDATE = ["/admin/dashboard", "/events", "/(proteccted)/events"];
const supabase = await createClient();

const normalizeRequirements = (requirements?: unknown) =>
  Array.isArray(requirements)
    ? requirements.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean)
    : [];

const normalizeCategoryRelation = (category?: unknown) => {
  if (!category) return [];
  if (Array.isArray(category)) {
    return category.filter(
      (item): item is { name?: string | null } =>
        typeof item === "object" && item !== null && "name" in item,
    );
  }

  if (typeof category === "object" && category !== null && "name" in category) {
    return [{ name: (category as { name?: string | null }).name ?? null }];
  }

  return [];
};

const sanitizePayload = (payload: AdminEventPayload) => {
  const normalized = {
    ...payload,
    category: payload.category?.trim() || null,
    requirements: normalizeRequirements(payload.requirements),
  };

  const { category: _ignoredCategory, ...rest } = adminEventPayloadSchema.parse(normalized);
  void _ignoredCategory;
  return rest;
};

const revalidateAdminPaths = () => {
  ADMIN_PATHS_TO_REVALIDATE.forEach((path) => {
    try {
      revalidatePath(path);
    } catch (error) {
      console.error(`Failed to revalidate ${path}`, error);
    }
  });
};

const parseAdminEvent = (event: Record<string, unknown>) =>
  adminEventSchema.parse({
    ...event,
    category: normalizeCategoryRelation(event.category),
    requirements: normalizeRequirements(event.requirements),
  });

export async function fetchAdminEvents(): Promise<AdminEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tbl_events")
    .select(
      "id, title, description, date, time, location, category:tbl_events_category(name), image_filename, requirements",
    )
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to fetch events for admin dashboard", error);
    return [];
  }

  return (data ?? []).map((event) => parseAdminEvent(event));
}

export async function createEventAction(payload: AdminEventPayload) {
  const supabase = await createClient();
  const dataToInsert = sanitizePayload(payload);
  const { data, error } = await supabase
    .from("tbl_events")
    .insert(dataToInsert)
    .select(
      "id, title, description, date, time, location, image_filename, requirements, category:tbl_events_category(name)",
    )
    .single();

  if (error || !data) {
    console.error("Failed to create event", error);
    throw new Error(error?.message ?? "Unable to create event.");
  }

  revalidateAdminPaths();

  return parseAdminEvent(data);
}

export async function updateEventAction(payload: AdminEventPayload & { id: number | string }) {
  const supabase = await createClient();
  const { id, ...rest } = payload;
  const dataToUpdate = sanitizePayload(rest);
  const { data, error } = await supabase
    .from("tbl_events")
    .update(dataToUpdate)
    .eq("id", id)
    .select(
      "id, title, description, date, time, location, image_filename, requirements, category:tbl_events_category(name)",
    )
    .single();

  if (error || !data) {
    console.error("Failed to update event", error);
    throw new Error(error?.message ?? "Unable to update event.");
  }
  console.log(data)

  revalidateAdminPaths();

  return parseAdminEvent(data);
}

export async function deleteEventAction(id: number | string) {
 
  const { error } = await supabase.from("tbl_events").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete event", error);
    throw new Error(error.message ?? "Unable to delete event.");
  }

  revalidateAdminPaths();

  return { success: true };
}

//fetching events category
export async function fetchEventsCategory(){
  const { data, error } = await supabase.from("tbl_events_category").select('id, name');
  if (error) {
    console.error("Failed to fetching category event", error);
    throw new Error(error.message ?? "Unable to fetch category event.");
  }
  return data

}


export async function uploadEventImage(formData: FormData): Promise<string> {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be less than 5MB");
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = fileName;

  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from("events_image")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Failed to upload image", error);
    throw new Error(error.message ?? "Unable to upload image.");
  }

  return data.path;
}

