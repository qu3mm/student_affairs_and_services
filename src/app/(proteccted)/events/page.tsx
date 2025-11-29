import { createClient } from "@/utils/supabase/server";
import EventListingClient from "@/components/event-listing";
import type { Event } from "@/lib/events";

export default async function EventListingPage() {
  const supabase = await createClient();

  const { data: eventsRaw, error } = await supabase
    .from("tbl_events")
    .select(
      "id, title, description, date, time, location, image_filename, requirements, category:tbl_events_category(name)"
    );

  if (error) {
    console.error("Error fetching events:", error);
    return (
      <div className="min-h-screen bg-background p-8">
        Error loading events.
      </div>
    );
  }

  // Optimized image URL resolver - uses public URLs directly without expensive HEAD checks
  const resolveImageUrl = (ev: Record<string, unknown>): string | null => {
    const imageFilename = (ev as { image_filename?: string }).image_filename;
    const bucket = "events_image";

    // Primary: Use image_filename if available (most common case)
    if (imageFilename) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(imageFilename);
      return data?.publicUrl || null;
    }

    // Legacy: Try img_id with common extensions (no HEAD checks for performance)
    const imgId = (ev as { img_id?: string }).img_id;
    if (imgId) {
      const extensions = [".jpg", ".jpeg", ".png", ".webp"];
      for (const ext of extensions) {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(`${imgId}${ext}`);
        if (data?.publicUrl) return data.publicUrl;
      }
    }

    return null;
  };

  const events = (eventsRaw || []) as Record<string, unknown>[];

  // Resolve all image URLs synchronously (no async needed for getPublicUrl)
  const eventsWithImages = events.map((ev) => {
    const imageUrl = resolveImageUrl(ev);
    return {
      ...ev,
      image_url: imageUrl ?? undefined, // Convert null to undefined
    };
  });

  return (
    <EventListingClient
      events={eventsWithImages as unknown as Array<
        Event & { image_url?: string; category: { name: string } }
      >}
    />
  );
}
