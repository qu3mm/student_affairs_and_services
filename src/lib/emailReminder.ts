import type { Event } from "./events";
import { getEventDateRange } from "./googleCalendar";

type SendResult =
  | { sent: true }
  | { sent: false; reason: string; status?: number; detail?: string };

export async function sendReminderIfEventTomorrow(
  event: Partial<Event> & { date: string; title?: string },
  userEmail?: string | null
): Promise<SendResult> {
  if (!userEmail) return { sent: false, reason: "no_user_email" };

  const { start } = getEventDateRange(
    event as Partial<Event> & { date: string }
  );
  if (!start) return { sent: false, reason: "no_start_date" };

  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const isTomorrow =
    start.getFullYear() === tomorrow.getFullYear() &&
    start.getMonth() === tomorrow.getMonth() &&
    start.getDate() === tomorrow.getDate();

  if (!isTomorrow) return { sent: false, reason: "not_tomorrow" };

  const subject = `Reminder: ${event.title || "Event"} starts tomorrow`;

const plainText = `Reminder: ${event.title || "Event"} starts on ${start.toLocaleString()}

Location: ${(event.location as string) || "TBA"}

${(event.longDescription as string) || (event.description as string) || ""}`;

const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">Event Reminder</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Event:</strong> ${escapeHtml(event.title || "Event")}</p>
            <p style="margin: 0 0 10px 0;"><strong>Date & Time:</strong> ${escapeHtml(start.toLocaleString())}</p>
            <p style="margin: 0;"><strong>Location:</strong> ${escapeHtml((event.location as string) || "TBA")}</p>
        </div>
    </div>
`;

  const resendKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ||
    `no-reply@${process.env.NEXT_PUBLIC_VERCEL_URL || "localhost"}`;

  if (!resendKey) {
    console.log(
      "emailReminder: RESEND_API_KEY not set — would send to",
      userEmail,
      { subject, plainText }
    );
    return { sent: false, reason: "resend_not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [userEmail],
        subject,
        html,
        text: plainText,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("emailReminder: Resend error", res.status, detail);
      return {
        sent: false,
        reason: "resend_error",
        status: res.status,
        detail,
      };
    }

    return { sent: true };
  } catch (err) {
    console.error("emailReminder: Resend fetch failed", err);
    return { sent: false, reason: "resend_fetch_error", detail: String(err) };
  }
}

function escapeHtml(str?: string) {
  if (!str) return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
