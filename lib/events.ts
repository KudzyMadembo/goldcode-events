import { GoldCodeEvent } from "./types";

export const springHeat: GoldCodeEvent = {
  id: "spring-heat-2026",
  slug: "africa-to-aotearoa-spring-heat",
  name: "The Link Up — Spring Heat",
  series: "Africa to Aotearoa",
  description:
    "Labour Weekend lands differently when the whole room moves together. Expect Afrobeats, Amapiano, Afro Sungura, R&B, Hip Hop, Dancehall, Gqom and more.",
  startsAt: "2026-10-24T21:30:00+13:00",
  endsAt: "2026-10-25T03:00:00+13:00",
  venue: "Vogue Lounge",
  address: "19/137 Quay Street, Auckland CBD, Auckland 1010",
  city: "Auckland",
  ageRestriction: "R18 — valid photo ID required",
  ticketUrl: "https://events.humanitix.com/africa-to-aotearoa-the-link-up-spring-heat",
  imageUrl: "/images/goldcode-hero.png",
  status: "low_availability",
  publishState: "published",
};

export const seedEvents = [springHeat];

export const statusLabels = {
  coming_soon: "Coming soon",
  available: "Tickets available",
  low_availability: "Early bird nearly gone",
  sold_out: "Sold out",
  postponed: "Postponed",
  cancelled: "Cancelled",
} as const;

export const formatEventDate = (iso: string) =>
  new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
