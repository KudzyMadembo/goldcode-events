import { createPublicClient } from "@/lib/supabase/context";
import { seedEvents } from "@/lib/events";
import { assetPath } from "@/lib/paths";
import type { EventStatus, GalleryPhoto, GoldCodeEvent } from "@/lib/types";

const curatedPhotos: GalleryPhoto[] = [
  { id: "cn-9238", src: "/images/gallery/cn-9238.jpg", alt: "A circle of guests dancing and clapping under festoon lights at Curated Nights", caption: "The floor", sortOrder: 0 },
  { id: "cn-9218", src: "/images/gallery/cn-9218.jpg", alt: "Guests with their hands in the air beside the Curated Nights sign", caption: "Hands up", sortOrder: 1 },
  { id: "cn-9219", src: "/images/gallery/cn-9219.jpg", alt: "A crowded bar with guests dancing and toasting at Curated Nights", caption: "The bar", sortOrder: 2 },
  { id: "cn-9220", src: "/images/gallery/cn-9220.jpg", alt: "Guests dancing in a line along the bar at Curated Nights", caption: "Along the bar", sortOrder: 3 },
  { id: "cn-9256", src: "/images/gallery/cn-9256.jpg", alt: "Friends singing and dancing together beneath the lights", caption: "That chorus", sortOrder: 4 },
  { id: "cn-9180", src: "/images/gallery/cn-9180.jpg", alt: "Guests dancing with their hands raised under festoon lights", caption: "In the room", sortOrder: 5 },
  { id: "cn-9205", src: "/images/gallery/cn-9205.jpg", alt: "Friends posing with drinks while the room carries on behind them", caption: "The round", sortOrder: 6 },
  { id: "cn-9261", src: "/images/gallery/cn-9261.jpg", alt: "Friends gathered at a table with more guests behind them", caption: "The table", sortOrder: 7 },
];

type GalleryRow = {
  id: string;
  image_path: string;
  alt_text: string;
  caption: string;
  sort_order: number;
};

type EventRow = {
  id: string;
  slug: string;
  title: string;
  name: string;
  series: string | null;
  place_line: string;
  paragraphs: string[] | null;
  description: string;
  past: boolean;
  starts_at: string | null;
  ends_at: string | null;
  venue: string;
  address: string;
  city: string;
  age_restriction: string;
  ticket_url: string;
  image_path: string;
  status: EventStatus;
  publish_state: "draft" | "published";
  sort_order: number;
  gallery_items: GalleryRow[] | null;
};

export function photoSrc(path: string) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return assetPath(path);
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/event-photos/${path}`;
}

function mapPhoto(row: GalleryRow): GalleryPhoto {
  return {
    id: row.id,
    src: photoSrc(row.image_path),
    alt: row.alt_text || "Photograph from a GoldCode night",
    caption: row.caption,
    sortOrder: row.sort_order,
  };
}

function mapEvent(row: EventRow): GoldCodeEvent {
  const photos = (row.gallery_items ?? []).slice().sort((a, b) => a.sort_order - b.sort_order).map(mapPhoto);
  return {
    id: row.id,
    slug: row.slug,
    sortOrder: row.sort_order,
    title: row.title,
    name: row.name,
    series: row.series,
    placeLine: row.place_line,
    paragraphs: row.paragraphs ?? [],
    description: row.description,
    past: row.past,
    startsAt: row.starts_at ?? "",
    endsAt: row.ends_at ?? "",
    venue: row.venue,
    address: row.address,
    city: row.city,
    ageRestriction: row.age_restriction,
    ticketUrl: row.ticket_url,
    imageUrl: row.image_path ? photoSrc(row.image_path) : photos[0]?.src ?? "",
    galleryHref: photos.length ? `/events/${row.slug}#photos` : "",
    status: row.status,
    publishState: row.publish_state,
    photos,
  };
}

function fallbackEvents() {
  return seedEvents.map((event) =>
    event.slug === "curated-nights"
      ? { ...event, photos: curatedPhotos, imageUrl: curatedPhotos[0].src, galleryHref: `/events/${event.slug}#photos` }
      : event,
  );
}

export async function loadPublishedEvents(): Promise<GoldCodeEvent[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("events")
      .select("*, gallery_items(*)")
      .eq("publish_state", "published")
      .order("sort_order")
      .order("sort_order", { foreignTable: "gallery_items" });
    if (error || !data) return fallbackEvents();
    return (data as EventRow[]).map(mapEvent);
  } catch {
    return fallbackEvents();
  }
}

export function featuredEvent(events: GoldCodeEvent[]) {
  return events
    .filter((event) => !event.past && event.startsAt)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0] ?? null;
}

export function illustratedPastEvent(events: GoldCodeEvent[]) {
  return events
    .filter((event) => event.past && event.photos.length > 0)
    .sort((a, b) => {
      if (a.startsAt && b.startsAt) return b.startsAt.localeCompare(a.startsAt);
      if (a.startsAt) return -1;
      if (b.startsAt) return 1;
      return b.sortOrder - a.sortOrder;
    })[0] ?? null;
}

export function galleryGroups(events: GoldCodeEvent[]) {
  return events.filter((event) => event.past && event.photos.length > 0).sort((a, b) => a.sortOrder - b.sortOrder);
}

export const doorsLabel = (event: GoldCodeEvent) => {
  if (!event.startsAt || !event.endsAt) return "";
  const format = new Intl.DateTimeFormat("en-NZ", { timeZone: "Pacific/Auckland", hour: "numeric", minute: "2-digit" });
  return `${format.format(new Date(event.startsAt))}–${format.format(new Date(event.endsAt))}`;
};
