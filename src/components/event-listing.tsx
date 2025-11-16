"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Search, Filter } from "lucide-react";
import { formatDate, getCategoryColor, type Event } from "@/lib/events";
import { Separator } from "@/components/ui/separator";

type EventWithImage = Event & { image_url?: string };

export default function EventListingClient({
  events,
}: {
  events: EventWithImage[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timeframe, setTimeframe] = useState<
    "All" | "Upcoming" | "Ongoing" | "Past"
  >("All");

  console.log("Rendering EventListingClient with events:", events);

  // Dynamically generate categories from events data
  const uniqueCategories = Array.from(
    new Set(events.map((event) => event.category).filter(Boolean))
  ).sort() as string[];

  const categories = ["All", ...uniqueCategories];

  // Compute filtered events instead of storing in state
  // helper to compute event status relative to today (date-only)
  const getEventStatus = (dateStr?: string) => {
    if (!dateStr) return "upcoming" as const;
    const ev = new Date(dateStr);
    if (isNaN(ev.getTime())) return "upcoming" as const;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const evDate = new Date(ev.getFullYear(), ev.getMonth(), ev.getDate());
    if (evDate.getTime() === today.getTime()) return "ongoing" as const;
    if (evDate.getTime() > today.getTime()) return "upcoming" as const;
    return "past" as const;
  };

  const filteredEvents = events.filter((event: EventWithImage) => {
    // Case-insensitive category matching
    const categoryMatch =
      selectedCategory === "All" ||
      (event.category &&
        event.category.toLowerCase() === selectedCategory.toLowerCase());

    // Search matching
    const searchMatch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    // timeframe matching
    let timeframeMatch = true;
    if (timeframe !== "All") {
      const status = getEventStatus(event.date);
      if (timeframe === "Upcoming") timeframeMatch = status === "upcoming";
      if (timeframe === "Ongoing") timeframeMatch = status === "ongoing";
      if (timeframe === "Past") timeframeMatch = status === "past";
    }

    return categoryMatch && searchMatch && timeframeMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Search + Filter */}

      <section className=" bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 text-base shadow-sm"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter by:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="text-sm font-medium"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <Separator
                orientation="vertical"
                className="hidden sm:block h-8"
              />

              {/* Timeframe Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  When:
                </span>
                <div className="flex flex-wrap gap-2">
                  {["All", "Upcoming", "Ongoing", "Past"].map((tf) => (
                    <Button
                      key={tf}
                      variant={timeframe === tf ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setTimeframe(
                          tf as "All" | "Upcoming" | "Ongoing" | "Past"
                        )
                      }
                      className="text-sm font-medium"
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {selectedCategory === "All" ? "All Events" : selectedCategory}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "event" : "events"} available
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: EventWithImage) => (
            <Card
              key={event.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 flex flex-col pt-0"
            >
              {/* Image Section */}
              <div className="relative w-full h-48 overflow-hidden bg-muted ">
                <Image
                  src={event.image_url || "/images/IMG_2200.jpg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />

                {/* Category Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <Badge
                    className={`${getCategoryColor(event.category)} shadow-md`}
                  >
                    {event.category}
                  </Badge>
                </div>
              </div>

              {/* Content Section - flex-grow to push button down */}
              <div className="flex flex-col grow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 grow flex flex-col">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2.5 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2.5 text-sm">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/80">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/80">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/80 line-clamp-1">
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button - mt-auto pushes it to bottom */}
                  <div className="mt-auto pt-4">
                    <Button
                      variant="default"
                      className="w-full group-hover:shadow-md transition-shadow"
                      asChild
                    >
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No events found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We could not find any events matching your criteria. Try adjusting
              your search or filter settings.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
