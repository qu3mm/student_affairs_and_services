
































import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendReminderIfEventTomorrow } from "@/lib/emailReminder";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventId = body?.eventId;
    if (!eventId) return NextResponse.json({ error: "eventId is required" }, { status: 400 });

    const supabase = await createClient();

    const { data: eventData, error: evError } = await supabase
      .from("tbl_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (evError || !eventData) {
      return NextResponse.json({ error: "event_not_found" }, { status: 404 });
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = (userData as { user?: { email?: string } })?.user;
    const userEmail = user?.email ?? null;

    const result = await sendReminderIfEventTomorrow(eventData as any, userEmail);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("/api/reminder/test error", err);
    return NextResponse.json({ error: "internal_error", detail: String(err) }, { status: 500 });
  }
}
