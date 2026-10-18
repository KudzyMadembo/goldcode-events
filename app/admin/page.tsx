import type { Metadata } from "next";
import { AdminEditor, AdminLogin } from "./ui";
import { createSupabaseContext } from "@/lib/supabase/context";
import { photoSrc } from "@/lib/catalog";
import type { EventStatus, GalleryPhoto, GoldCodeEvent } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type GalleryRow = { id: string; image_path: string; alt_text: string; caption: string; sort_order: number };
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

export default async function AdminPage() {
  const { data, error } = await createSupabaseContext({ auth: "user" });
  if (error || !data) return <main className="admin-shell"><AdminLogin /></main>;

  const { data: rows } = await data.supabase.from("events").select("*, gallery_items(*)").order("sort_order");
  const events: GoldCodeEvent[] = ((rows ?? []) as EventRow[]).map((row) => {
    const photos: GalleryPhoto[] = (row.gallery_items ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((photo) => ({
        id: photo.id,
        src: photoSrc(photo.image_path),
        alt: photo.alt_text,
        caption: photo.caption,
        sortOrder: photo.sort_order,
      }));
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
      imageUrl: row.image_path ? photoSrc(row.image_path) : "",
      galleryHref: "",
      status: row.status,
      publishState: row.publish_state,
      photos,
    };
  });

  return <main className="admin-shell"><AdminEditor events={events} /></main>;
}
