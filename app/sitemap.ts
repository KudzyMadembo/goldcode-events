import type { MetadataRoute } from "next";
import { loadPublishedEvents } from "@/lib/catalog";
import { pageUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await loadPublishedEvents();
  const paths = ["/", "/events", "/about", "/gallery", ...events.map((event) => `/events/${event.slug}`)];
  return paths.map((path) => ({ url: pageUrl(path) }));
}
