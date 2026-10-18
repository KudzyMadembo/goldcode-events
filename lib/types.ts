export type EventStatus =
  | "coming_soon"
  | "available"
  | "low_availability"
  | "sold_out"
  | "postponed"
  | "cancelled";

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  sortOrder: number;
};

export type GoldCodeEvent = {
  id: string;
  slug: string;
  sortOrder: number;
  photos: GalleryPhoto[];
  /** Full heading, as it should read on the events page. */
  title: string;
  /** Shorter name for titles, tickets, and the homepage. */
  name: string;
  series: string | null;
  placeLine: string;
  paragraphs: string[];
  description: string;
  past: boolean;
  startsAt: string;
  endsAt: string;
  venue: string;
  address: string;
  city: string;
  ageRestriction: string;
  ticketUrl: string;
  imageUrl: string;
  galleryHref: string;
  status: EventStatus;
  publishState: "draft" | "published";
};
