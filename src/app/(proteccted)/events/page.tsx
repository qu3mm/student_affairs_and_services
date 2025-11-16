import { createClient } from "@/utils/supabase/server";
import EventListingClient from "@/components/event-listing";
import type { Event } from "@/lib/events";

export default async function EventListingPage() {
  const supabase = await createClient();

  const { data: eventsRaw, error } = await supabase
    .from("tbl_events")
    .select("*");

  if (error) {
    console.error("Error fetching events:", error);
    return (
      <div className="min-h-screen bg-background p-8">
        Error loading events.
      </div>
    );
  }
  // Helper: try to find an image public URL for an event.
  // Uses either `img_id` (UUID) or `image_filename` fields if present.
  const tryResolveImageUrl = async (ev: Record<string, unknown>) => {
    const imgId = (ev as { img_id?: string }).img_id;
    const imageFilename = (ev as { image_filename?: string }).image_filename;

    const bucket = "events_image";

    // function that checks public URL availability via HEAD
    const checkUrl = async (url?: string | null) => {
      if (!url) return false;
      try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
      } catch {
        return false;
      }
    };

    // 1) If image_filename provided, try it first. Prefer signed URL (works for private buckets),
    // then fallback to public URL.
    if (imageFilename) {
      try {
        // createSignedUrl returns { data: { signedUrl } }
        const { data: signedData, error: signedErr } = await supabase.storage
          .from(bucket)
          .createSignedUrl(imageFilename as string, 60 * 60); // 1 hour
        if (!signedErr && signedData?.signedUrl) {
          if (await checkUrl(signedData.signedUrl)) return signedData.signedUrl;
        }
      } catch {
        // ignore signed url errors
      }

      // fallback to public url
      const { data: pub } = supabase.storage
        .from(bucket)
        .getPublicUrl(imageFilename as string);
      if (pub?.publicUrl) {
        if (await checkUrl(pub.publicUrl)) return pub.publicUrl;
      }
    }

    // 2) If imgId exists (legacy) — try listing and extensions (kept for backward compatibility)
    if (imgId) {
      try {
        const { data: listData, error: listErr } = await supabase.storage
          .from(bucket)
          .list("", { search: imgId as string, limit: 100 });

        if (!listErr && Array.isArray(listData) && listData.length > 0) {
          const exact = listData.find(
            (o) => o.name === imgId || o.name.startsWith(`${imgId}.`)
          );
          const pick = exact ? exact.name : listData[0].name;
          const { data } = supabase.storage.from(bucket).getPublicUrl(pick);
          if (data?.publicUrl && (await checkUrl(data.publicUrl)))
            return data.publicUrl;
        }
      } catch {
        // ignore listing errors and fall back to candidate names
      }

      const exts = [".jpg", ".jpeg", ".png", ".webp", ""]; // try with and without extension
      for (const ext of exts) {
        const candidate = `${imgId}${ext}`;
        const { data } = supabase.storage.from(bucket).getPublicUrl(candidate);
        if (data?.publicUrl && (await checkUrl(data.publicUrl)))
          return data.publicUrl;
      }
    }

    // 4) nothing found
    return null;
  };

  const events = (eventsRaw || []) as Record<string, unknown>[];

  const eventsWithImages = await Promise.all(
    events.map(async (ev) => {
      const image_url = await tryResolveImageUrl(ev);
      return { ...ev, image_url };
    })
  );

  // Debug: log first few resolved items (only id/img fields and image_url)
  try {
    const debug = eventsWithImages.slice(0, 8).map((e) => ({
      id: (e as Record<string, unknown>).id,
      img_id: (e as Record<string, unknown>).img_id,
      image_filename: (e as Record<string, unknown>).image_filename,
      image_url: (e as Record<string, unknown>).image_url,
    }));
    console.log("eventsWithImages (first items):", debug);
  } catch {
    // ignore logging errors
  }

  return <EventListingClient events={eventsWithImages as unknown as Event[]} />;
}
