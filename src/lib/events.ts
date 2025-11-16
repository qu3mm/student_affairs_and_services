import { createClient } from "@/utils/supabase/client";

export interface Event {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image_filename?: string | null;
  tags?: string[];
  requirements?: string[];
 
}

const supabase = createClient();

export const mockEvents = async () => {
  const { data: mockEvents } = await supabase.from("tbl_events").select("*");

  const events: Event[] = mockEvents || [];
  return events;
};

export async function getEventById(
  id: number
): Promise<Event | undefined> {
  const events = await mockEvents();
  return events?.find((event: Event) => event.id === id);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getCategoryColor(category: string): string {
  const colors = {
    Academic: "bg-blue-100 text-blue-800",
    FACTS: "bg-pink-100 text-pink-800",
    USG: "bg-green-100 text-green-800",
    JPICE: "bg-orange-100 text-orange-800",
    BESS: "bg-purple-100 text-purple-800",
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
}
