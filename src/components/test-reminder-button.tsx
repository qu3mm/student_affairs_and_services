"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestReminderButton({ eventId }: { eventId: number | string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleTest() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/reminder/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json?.error || "Failed to send reminder");
      } else {
        setMessage(JSON.stringify(json?.result || json));
      }
    } catch (err) {
      setMessage(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <Button onClick={handleTest} disabled={loading} variant="ghost">
        {loading ? "Sending..." : "Test Reminder"}
      </Button>
      {message && <div className="text-sm text-muted-foreground wrap-break-word max-w-xl">{message}</div>}
    </div>
  );
}
