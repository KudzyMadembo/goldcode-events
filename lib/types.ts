export type EventStatus =
  | "coming_soon"
  | "available"
  | "low_availability"
  | "sold_out"
  | "postponed"
  | "cancelled";

export type GoldCodeEvent = {
  id: string;
  slug: string;
  name: string;
  series: string | null;
  description: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  address: string;
  city: string;
  ageRestriction: string;
  ticketUrl: string;
  imageUrl: string;
  status: EventStatus;
  publishState: "draft" | "published";
};
