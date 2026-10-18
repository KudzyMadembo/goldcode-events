import { GoldCodeEvent } from "./types";
import { assetPath } from "./paths";

const curatedNights: GoldCodeEvent = {
  id: "curated-nights",
  slug: "curated-nights",
  sortOrder: 0,
  photos: [],
  title: "Curated Nights",
  name: "Curated Nights",
  series: null,
  placeLine: "Auckland, New Zealand",
  paragraphs: [
    "One of GoldCode Events’ early nightlife experiences, bringing together music, culture and community in an intimate Auckland setting.",
    "The night featured Massimo, And1, Aunty Rosa and BrotherhoodJZ, with a special appearance from the lead singer of SIX60.",
    "Curated Nights helped set the foundation for GoldCode Events — creating spaces where people from different backgrounds can connect through music and a great atmosphere.",
  ],
  description:
    "Curated Nights was an early GoldCode night in Auckland, with Massimo, And1, Aunty Rosa, BrotherhoodJZ and a special appearance from the lead singer of SIX60.",
  past: true,
  startsAt: "",
  endsAt: "",
  venue: "",
  address: "",
  city: "Auckland",
  ageRestriction: "",
  ticketUrl: "",
  imageUrl: assetPath("/images/gallery/cn-9219.jpg"),
  galleryHref: "/gallery",
  status: "sold_out",
  publishState: "published",
};

const holyTen: GoldCodeEvent = {
  id: "holy-ten-live-2026",
  slug: "holy-ten-live-auckland",
  sortOrder: 1,
  photos: [],
  title: "Holy Ten LIVE Auckland",
  name: "Holy Ten LIVE Auckland",
  series: null,
  placeLine: "30 May 2026 | Cassette Nine, Auckland",
  paragraphs: [
    "GoldCode Events brought Zimbabwean artist Holy Ten live to Auckland for a special King’s Birthday Weekend event.",
    "Supporting the night were Massimo, And1, Nkosy from Perth, Aunty Rosa and Nashe, bringing together local and international DJ talent for a celebration of music, culture and community.",
    "The event marked an important milestone for GoldCode Events and its growing presence within Auckland’s African entertainment scene.",
  ],
  description:
    "Holy Ten LIVE Auckland brought the Zimbabwean artist to Cassette Nine on 30 May 2026, with Massimo, And1, Nkosy from Perth, Aunty Rosa and Nashe.",
  past: true,
  startsAt: "2026-05-30T12:00:00+12:00",
  endsAt: "",
  venue: "Cassette Nine",
  address: "",
  city: "Auckland",
  ageRestriction: "",
  ticketUrl: "",
  imageUrl: "",
  galleryHref: "",
  status: "sold_out",
  publishState: "published",
};

const winterEdition: GoldCodeEvent = {
  id: "link-up-winter-2026",
  slug: "africa-to-aotearoa-winter-edition",
  sortOrder: 2,
  photos: [],
  title: "Africa to Aotearoa: The Link Up – Winter Edition",
  name: "The Link Up – Winter Edition",
  series: "Africa to Aotearoa",
  placeLine: "29 August 2026 | Cassette Nine, Auckland",
  paragraphs: [
    "The first Africa to Aotearoa: The Link Up brought Auckland together for a night centred around music, culture and connection.",
    "The DJ lineup featured Prince, Cue Birdy, Keighley Rivers, Massimo and Nashe, delivering a mix of Afrobeats, Amapiano, Afro sounds, Hip Hop, R&B, Dancehall, Gqom and more.",
    "The Winter Edition introduced what would become one of GoldCode Events’ signature concepts — uniting cultures through music.",
  ],
  description:
    "The Link Up – Winter Edition was at Cassette Nine, Auckland, on 29 August 2026. Prince, Cue Birdy, Keighley Rivers, Massimo and Nashe played Afrobeats, Amapiano and more.",
  past: true,
  startsAt: "2026-08-29T12:00:00+12:00",
  endsAt: "",
  venue: "Cassette Nine",
  address: "",
  city: "Auckland",
  ageRestriction: "",
  ticketUrl: "",
  imageUrl: "",
  galleryHref: "",
  status: "sold_out",
  publishState: "published",
};

export const springHeat: GoldCodeEvent = {
  id: "spring-heat-2026",
  slug: "africa-to-aotearoa-spring-heat",
  sortOrder: 3,
  photos: [],
  title: "Africa to Aotearoa: The Link Up – Spring Edition",
  name: "The Link Up – Spring Edition",
  series: "Africa to Aotearoa",
  placeLine: "24 October 2026 | Vogue Lounge, Auckland",
  paragraphs: [
    "The Link Up returns for its Spring Edition, bringing another diverse lineup and a fresh Labour Weekend experience to Auckland.",
    "Featuring Martina Mak, Prince, Cue Birdy, Massimo and Nashe, Spring Edition continues the GoldCode vision of bringing people together through Afrobeats, Amapiano, Afro sounds, R&B, Hip Hop, Dancehall, Gqom and more.",
    "A new venue, a bigger vision and another chapter in the Africa to Aotearoa story.",
  ],
  description:
    "The Link Up – Spring Edition is at Vogue Lounge, Auckland, on 24 October 2026. Martina Mak, Prince, Cue Birdy, Massimo and Nashe play Afrobeats, Amapiano and more.",
  past: false,
  startsAt: "2026-10-24T21:30:00+13:00",
  endsAt: "2026-10-25T03:00:00+13:00",
  venue: "Vogue Lounge",
  address: "19/137 Quay Street, Auckland CBD, Auckland 1010",
  city: "Auckland",
  ageRestriction: "R18 — valid photo ID required",
  ticketUrl: "https://events.humanitix.com/africa-to-aotearoa-the-link-up-spring-heat",
  imageUrl: "",
  galleryHref: "",
  status: "low_availability",
  publishState: "published",
};

export const seedEvents = [curatedNights, holyTen, winterEdition, springHeat];

export const statusLabels = {
  coming_soon: "Coming soon",
  available: "Tickets available",
  low_availability: "Early bird nearly gone",
  sold_out: "Sold out",
  postponed: "Postponed",
  cancelled: "Cancelled",
} as const;

export const formatEventDateShort = (iso: string) =>
  new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));

export const formatEventDate = (iso: string) =>
  new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
