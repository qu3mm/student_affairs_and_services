import { Event } from "./events";

function parseTimeString(timeStr?: string) {
  if (!timeStr) return null;
  const part = timeStr.trim();
  const m = part.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minutes = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = m[3];
  if (ampm) {
    const a = ampm.toLowerCase();
    if (a === "pm" && hour !== 12) hour += 12;
    if (a === "am" && hour === 12) hour = 0;
  }
  return { hour, minutes };
}

function toGoogleDateTimeUTC(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildGoogleCalendarUrl(event: Partial<Event> & { date: string; title: string }) {
  try {
    const dateBase = new Date(event.date as string);

    let start: Date | null = null;
    let end: Date | null = null;

    if (event.time && event.time.includes("-")) {
      const [s, e] = event.time.split("-").map((p) => p.trim());
      const ps = parseTimeString(s);
      const pe = parseTimeString(e);
      if (ps) {
        start = new Date(dateBase);
        start.setHours(ps.hour, ps.minutes, 0, 0);
      }
      if (pe) {
        end = new Date(dateBase);
        end.setHours(pe.hour, pe.minutes, 0, 0);
      }
    } else if (event.time) {
      const ps = parseTimeString(event.time);
      if (ps) {
        start = new Date(dateBase);
        start.setHours(ps.hour, ps.minutes, 0, 0);
        end = new Date(start.getTime() + 60 * 60 * 1000);
      }
    }

    if (!start) {
      start = new Date(dateBase);
      start.setHours(0, 0, 0, 0);
      end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    }
    if (!end) {
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }

    const startStr = toGoogleDateTimeUTC(start);
    const endStr = toGoogleDateTimeUTC(end);

    const details = (event.longDescription as string) || (event.description as string) || "";

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${startStr}/${endStr}`,
      details,
      location: (event.location as string) || "",
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
  } catch {
    return "https://www.google.com/calendar";
  }
}

export function getEventDateRange(event: Partial<Event> & { date: string }) {
  try {
    const dateBase = new Date(event.date as string);

    let start: Date | null = null;
    let end: Date | null = null;

    if (event.time && event.time.includes("-")) {
      const [s, e] = event.time.split("-").map((p) => p.trim());
      const ps = parseTimeString(s);
      const pe = parseTimeString(e);
      if (ps) {
        start = new Date(dateBase);
        start.setHours(ps.hour, ps.minutes, 0, 0);
      }
      if (pe) {
        end = new Date(dateBase);
        end.setHours(pe.hour, pe.minutes, 0, 0);
      }
    } else if (event.time) {
      const ps = parseTimeString(event.time);
      if (ps) {
        start = new Date(dateBase);
        start.setHours(ps.hour, ps.minutes, 0, 0);
        end = new Date(start.getTime() + 60 * 60 * 1000);
      }
    }

    if (!start) {
      start = new Date(dateBase);
      start.setHours(0, 0, 0, 0);
      end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    }
    if (!end) {
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }

    return { start, end };
  } catch {
    return { start: null, end: null };
  }
}
