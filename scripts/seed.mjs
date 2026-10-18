import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const url = env.SUPABASE_URL;
const secret = env.SUPABASE_SECRET_KEY;
const headers = {
  apikey: secret,
  Authorization: `Bearer ${secret}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=representation",
};

const photos = [
  ["cn-9238.jpg", "A circle of guests dancing and clapping under festoon lights at Curated Nights", "The floor"],
  ["cn-9218.jpg", "Guests with their hands in the air beside the Curated Nights sign", "Hands up"],
  ["cn-9219.jpg", "A crowded bar with guests dancing and toasting at Curated Nights", "The bar"],
  ["cn-9220.jpg", "Guests dancing in a line along the bar at Curated Nights", "Along the bar"],
  ["cn-9256.jpg", "Friends singing and dancing together beneath the lights", "That chorus"],
  ["cn-9180.jpg", "Guests dancing with their hands raised under festoon lights", "In the room"],
  ["cn-9205.jpg", "Friends posing with drinks while the room carries on behind them", "The round"],
  ["cn-9261.jpg", "Friends gathered at a table with more guests behind them", "The table"],
];

const events = [
  {
    slug: "curated-nights",
    title: "Curated Nights",
    name: "Curated Nights",
    series: null,
    place_line: "Auckland, New Zealand",
    paragraphs: [
      "One of GoldCode Events’ early nightlife experiences, bringing together music, culture and community in an intimate Auckland setting.",
      "The night featured Massimo, And1, Aunty Rosa and BrotherhoodJZ, with a special appearance from the lead singer of SIX60.",
      "Curated Nights helped set the foundation for GoldCode Events — creating spaces where people from different backgrounds can connect through music and a great atmosphere.",
    ],
    description: "Curated Nights was an early GoldCode night in Auckland, with Massimo, And1, Aunty Rosa, BrotherhoodJZ and a special appearance from the lead singer of SIX60.",
    past: true,
    starts_at: null,
    ends_at: null,
    venue: "",
    address: "",
    city: "Auckland",
    age_restriction: "",
    ticket_url: "",
    image_path: "/images/gallery/cn-9238.jpg",
    status: "sold_out",
    publish_state: "published",
    sort_order: 0,
  },
  {
    slug: "holy-ten-live-auckland",
    title: "Holy Ten LIVE Auckland",
    name: "Holy Ten LIVE Auckland",
    series: null,
    place_line: "30 May 2026 | Cassette Nine, Auckland",
    paragraphs: [
      "GoldCode Events brought Zimbabwean artist Holy Ten live to Auckland for a special King’s Birthday Weekend event.",
      "Supporting the night were Massimo, And1, Nkosy from Perth, Aunty Rosa and Nashe, bringing together local and international DJ talent for a celebration of music, culture and community.",
      "The event marked an important milestone for GoldCode Events and its growing presence within Auckland’s African entertainment scene.",
    ],
    description: "Holy Ten LIVE Auckland brought the Zimbabwean artist to Cassette Nine on 30 May 2026, with Massimo, And1, Nkosy from Perth, Aunty Rosa and Nashe.",
    past: true,
    starts_at: "2026-05-30T12:00:00+12:00",
    ends_at: null,
    venue: "Cassette Nine",
    address: "",
    city: "Auckland",
    age_restriction: "",
    ticket_url: "",
    image_path: "",
    status: "sold_out",
    publish_state: "published",
    sort_order: 1,
  },
  {
    slug: "africa-to-aotearoa-winter-edition",
    title: "Africa to Aotearoa: The Link Up – Winter Edition",
    name: "The Link Up – Winter Edition",
    series: "Africa to Aotearoa",
    place_line: "29 August 2026 | Cassette Nine, Auckland",
    paragraphs: [
      "The first Africa to Aotearoa: The Link Up brought Auckland together for a night centred around music, culture and connection.",
      "The DJ lineup featured Prince, Cue Birdy, Keighley Rivers, Massimo and Nashe, delivering a mix of Afrobeats, Amapiano, Afro sounds, Hip Hop, R&B, Dancehall, Gqom and more.",
      "The Winter Edition introduced what would become one of GoldCode Events’ signature concepts — uniting cultures through music.",
    ],
    description: "The Link Up – Winter Edition was at Cassette Nine, Auckland, on 29 August 2026. Prince, Cue Birdy, Keighley Rivers, Massimo and Nashe played Afrobeats, Amapiano and more.",
    past: true,
    starts_at: "2026-08-29T12:00:00+12:00",
    ends_at: null,
    venue: "Cassette Nine",
    address: "",
    city: "Auckland",
    age_restriction: "",
    ticket_url: "",
    image_path: "",
    status: "sold_out",
    publish_state: "published",
    sort_order: 2,
  },
  {
    slug: "africa-to-aotearoa-spring-heat",
    title: "Africa to Aotearoa: The Link Up – Spring Edition",
    name: "The Link Up – Spring Edition",
    series: "Africa to Aotearoa",
    place_line: "24 October 2026 | Vogue Lounge, Auckland",
    paragraphs: [
      "The Link Up returns for its Spring Edition, bringing another diverse lineup and a fresh Labour Weekend experience to Auckland.",
      "Featuring Martina Mak, Prince, Cue Birdy, Massimo and Nashe, Spring Edition continues the GoldCode vision of bringing people together through Afrobeats, Amapiano, Afro sounds, R&B, Hip Hop, Dancehall, Gqom and more.",
      "A new venue, a bigger vision and another chapter in the Africa to Aotearoa story.",
    ],
    description: "The Link Up – Spring Edition is at Vogue Lounge, Auckland, on 24 October 2026. Martina Mak, Prince, Cue Birdy, Massimo and Nashe play Afrobeats, Amapiano and more.",
    past: false,
    starts_at: "2026-10-24T21:30:00+13:00",
    ends_at: "2026-10-25T03:00:00+13:00",
    venue: "Vogue Lounge",
    address: "19/137 Quay Street, Auckland CBD, Auckland 1010",
    city: "Auckland",
    age_restriction: "R18 — valid photo ID required",
    ticket_url: "https://events.humanitix.com/africa-to-aotearoa-the-link-up-spring-heat",
    image_path: "",
    status: "low_availability",
    publish_state: "published",
    sort_order: 3,
  },
];

const saved = await fetch(`${url}/rest/v1/events?on_conflict=slug`, {
  method: "POST",
  headers,
  body: JSON.stringify(events),
});
const savedText = await saved.text();
if (!saved.ok) {
  console.error(saved.status, savedText.slice(0, 400));
  process.exit(1);
}
const rows = JSON.parse(savedText);
const curated = rows.find((row) => row.slug === "curated-nights");
const existing = await fetch(`${url}/rest/v1/gallery_items?event_id=eq.${curated.id}&select=id`, { headers });
const current = await existing.json();
if (!current.length) {
  const gallery = await fetch(`${url}/rest/v1/gallery_items`, {
    method: "POST",
    headers,
    body: JSON.stringify(photos.map(([file, alt, caption], sortOrder) => ({
      event_id: curated.id,
      image_path: `/images/gallery/${file}`,
      alt_text: alt,
      caption,
      sort_order: sortOrder,
    }))),
  });
  if (!gallery.ok) {
    console.error(gallery.status, (await gallery.text()).slice(0, 400));
    process.exit(1);
  }
}
console.log(`Seeded ${rows.length} events.`);
