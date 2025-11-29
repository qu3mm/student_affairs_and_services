"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, RefreshCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  createEventAction,
  deleteEventAction,
  updateEventAction,
  uploadEventImage,
} from "@/app/admin/events/actions";
import type { AdminEvent } from "@/lib/zod/admin-dashboard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { EventsDataTable } from "./events-datatable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectGroup } from "@radix-ui/react-select";

type EventFormState = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image_filename: string;
  requirements: string;
};

type ImageFileState = {
  file: File | null;
  preview: string | null;
};

type FormErrors = Partial<Record<keyof EventFormState, string>>;

const emptyFormState: EventFormState = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  category: "",
  image_filename: "",
  requirements: "",
};

const toComparableDate = (value?: string | null) => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
};

const sortEvents = (events: AdminEvent[]) =>
  [...events].sort(
    (a, b) => toComparableDate(a.date) - toComparableDate(b.date)
  );

const extractCategoryNames = (category?: AdminEvent["category"]) => {
  if (!category || category.length === 0) {
    return [];
  }

  return category
    .map((item) => item?.name)
    .filter((name): name is string => Boolean(name && name.trim()));
};

const getCategoryLabel = (category?: AdminEvent["category"]) => {
  const names = extractCategoryNames(category);
  return names.length ? names.join(", ") : "";
};

type EventsDashboardProps = {
  events: AdminEvent[];
};

const EventsDashboard = ({ events: initialEvents }: EventsDashboardProps) => {
  const [events, setEvents] = useState<AdminEvent[]>(() =>
    sortEvents(initialEvents)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<AdminEvent | null>(null);
  const [formState, setFormState] = useState<EventFormState>(emptyFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<ImageFileState>({
    file: null,
    preview: null,
  });
  const [isPending, startTransition] = useTransition();

  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) {
      return events;
    }

    const query = searchTerm.toLowerCase();
    return events.filter((event) => {
      const categoryLabel = getCategoryLabel(event.category).toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        categoryLabel.includes(query)
      );
    });
  }, [events, searchTerm]);

  const handleOpenCreate = () => {
    setActiveEvent(null);
    setFormState(emptyFormState);
    setFormErrors({});
    setImageFile({ file: null, preview: null });
    setSheetOpen(true);
  };

  const handleOpenEdit = (event: AdminEvent) => {
    setActiveEvent(event);
    setFormState({
      title: event.title ?? "",
      description: event.description ?? "",
      date: event.date ?? "",
      time: event.time ?? "",
      location: event.location ?? "",
      category: getCategoryLabel(event.category),
      image_filename: event.image_filename ?? "",
      requirements: (event.requirements ?? []).join("\n"),
    });
    setFormErrors({});
    setImageFile({ file: null, preview: null });
    setSheetOpen(true);
  };

  const handleSheetToggle = (nextValue: boolean) => {
    setSheetOpen(nextValue);
    if (!nextValue) {
      setActiveEvent(null);
      setFormErrors({});
      setImageFile({ file: null, preview: null });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveImage = () => {
    if (imageFile.preview) {
      URL.revokeObjectURL(imageFile.preview);
    }
    setImageFile({ file: null, preview: null });
  };

  const updateField = (field: keyof EventFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!formState.title.trim()) errors.title = "Title is required.";
    if (!formState.description.trim())
      errors.description = "Description is required.";
    if (!formState.date) errors.date = "Date is required.";
    if (!formState.time) errors.time = "Time is required.";
    if (!formState.location.trim()) errors.location = "Location is required.";

    return errors;
  };

  const parseRequirements = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    startTransition(async () => {
      try {
        let imageFilename = formState.image_filename.trim() || null;

        // Upload new image if provided
        if (imageFile.file) {
          const formData = new FormData();
          formData.append("file", imageFile.file);
          imageFilename = await uploadEventImage(formData);
        }

        const payload = {
          title: formState.title.trim(),
          description: formState.description.trim(),
          date: formState.date,
          time: formState.time,
          location: formState.location.trim(),
          category: formState.category.trim() || null,
          image_filename: imageFilename,
          requirements: parseRequirements(formState.requirements),
        };

        if (activeEvent) {
          const updated = await updateEventAction({
            id: activeEvent.id,
            ...payload,
          });
          setEvents((prev) =>
            sortEvents(
              prev.map((event) => (event.id === updated.id ? updated : event))
            )
          );
          toast.success("Event updated successfully.");
        } else {
          const created = await createEventAction(payload);
          setEvents((prev) => sortEvents([...prev, created]));
          toast.success("Event created successfully.");
        }
        handleSheetToggle(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";
        toast.error(message);
      }
    });
  };

  const handleDelete = (eventId: number | string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteEventAction(eventId);
        setEvents((prev) =>
          prev.filter((event) => String(event.id) !== String(eventId))
        );
        toast.success("Event deleted successfully.");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to delete the event. Please retry.";
        toast.error(message);
      }
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setEvents((prev) => sortEvents(prev));
  };

  return (
    <>
      <Card className="mt-2">
        <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-xl">Events Manager</CardTitle>
            <CardDescription>
              Create, review, update, and delete upcoming student affairs
              events.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full"
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Reset filters"
                onClick={handleResetFilters}
              >
                <RefreshCcw className="size-4" />
              </Button>
            </div>
            <Button className="whitespace-nowrap" onClick={handleOpenCreate}>
              <Plus className="size-4" />
              Add event
            </Button>
          </div>
        </CardHeader>

        {/* <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="px-6">
                  <TableHead className="min-w-[200px] px-6">Title</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[120px]">Time</TableHead>
                  <TableHead className="min-w-[180px]">Location</TableHead>
                  <TableHead className="min-w-[140px]">Category</TableHead>
                  <TableHead className="w-[160px] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                      No events found. Try broadening your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="align-top px-6">
                        <div className="font-medium text-foreground">{event.title}</div>
                        
                      </TableCell>
                      <TableCell className="align-top">{event.date}</TableCell>
                      <TableCell className="align-top">{event.time}</TableCell>
                      <TableCell className="align-top">{event.location}</TableCell>
                      <TableCell className="align-top">
                        {(() => {
                          const categoryNames = extractCategoryNames(event.category);
                          if (!categoryNames.length) {
                            return (
                              <span className="text-muted-foreground text-sm">Uncategorized</span>
                            );
                          }

                          return (
                            <div className="flex flex-wrap gap-1">
                              {categoryNames.map((name) => (
                                <Badge key={`${event.id}-${name}`} variant="secondary">
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="align-top pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(event)}
                            disabled={isPending}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent> */}
        <EventsDataTable
          data={events}
          extractCategoryNames={extractCategoryNames}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          isPending={isPending}
        />
      </Card>

      <Sheet open={sheetOpen} onOpenChange={handleSheetToggle}>
        <SheetContent side="right" className="w-full gap-0 px-0 sm:max-w-lg">
          <SheetHeader className="px-6">  
            <SheetTitle>
              {activeEvent ? "Edit event" : "Create event"}
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              {activeEvent
                ? "Update the event details below."
                : "Fill in the form to publish a new event."}
            </p>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Event title"
                value={formState.title}
                onChange={(event) => updateField("title", event.target.value)}
                aria-invalid={Boolean(formErrors.title)}
              />
              {formErrors.title && (
                <p className="text-sm text-destructive">{formErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this event about?"
                value={formState.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={4}
                aria-invalid={Boolean(formErrors.description)}
              />
              {formErrors.description && (
                <p className="text-sm text-destructive">
                  {formErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formState.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  aria-invalid={Boolean(formErrors.date)}
                />
                {formErrors.date && (
                  <p className="text-sm text-destructive">{formErrors.date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formState.time}
                  onChange={(event) => updateField("time", event.target.value)}
                  aria-invalid={Boolean(formErrors.time)}
                />
                {formErrors.time && (
                  <p className="text-sm text-destructive">{formErrors.time}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Campus, building, or room"
                value={formState.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                aria-invalid={Boolean(formErrors.location)}
              />
              {formErrors.location && (
                <p className="text-sm text-destructive">
                  {formErrors.location}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formState.category}
                onValueChange={(value) => updateField("category", value)}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="fundraiser">Fundraiser</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Event Image</Label>
              {imageFile.preview ? (
                <div className="relative">
                  <img
                    src={imageFile.preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    Upload an image for this event (JPEG, PNG, GIF, or WebP, max
                    5MB)
                  </div>
                  {formState.image_filename && !imageFile.file && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Current image: {formState.image_filename}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                placeholder={"Bring ID card\nSubmit form before deadline"}
                value={formState.requirements}
                onChange={(event) =>
                  updateField("requirements", event.target.value)
                }
                rows={4}
              />
            </div>
          </div>

          <SheetFooter className="flex-row gap-2 px-6 py-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleSheetToggle(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : activeEvent
                ? "Update event"
                : "Create event"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EventsDashboard;
