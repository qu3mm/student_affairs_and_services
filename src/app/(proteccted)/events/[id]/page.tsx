import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getCategoryColor, type Event } from "@/lib/events";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { buildGoogleCalendarUrl } from "@/lib/googleCalendar";

type EventWithImage = Event & {
  image_url?: string | null;
};

export default async function EventDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch event data
  const { data: eventData, error } = await supabase
    .from("tbl_events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !eventData) {
    return notFound();
  }

  // Get image URL from storage
  let imageUrl = null;
  if (eventData.image_filename) {
    const { data } = supabase.storage
      .from("events_image")
      .getPublicUrl(eventData.image_filename);
    imageUrl = data.publicUrl;
  }

  const event: EventWithImage = {
    ...eventData,
    image_url: imageUrl,
  };

  // Format date on server to avoid hydration mismatch
  const formattedDate = formatDate(event.date);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-muted">
        <Image
          src={event.image_url || "/images/IMG_2200.jpg"}
          alt={event.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
            <Badge className={`${getCategoryColor(event.category)} mb-4 shadow-lg`}>
              {event.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>

        {/* Event Description */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">About this event</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed text-base">
                {event.description}
              </p>
            </div>

            {/* Requirements Section */}
            {event.requirements && Array.isArray(event.requirements) && event.requirements.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Meta Info - Bottom */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                  <p className="text-base font-semibold">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Time</p>
                  <p className="text-base font-semibold">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                  <p className="text-base font-semibold">{event.location}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button asChild variant="outline">
                <a
                  href={buildGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add to Google Calendar
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}