import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, MapPin, Ticket } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { loadPublishedEvents } from "@/lib/catalog";
import { absoluteAsset, pageMetadata, pageUrl, siteName, webPageJsonLd } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const events = await loadPublishedEvents();
  const event = events.find((item) => item.slug === slug);
  if (!event) return {};
  return pageMetadata({
    title: `${event.name} | GoldCode Events`,
    description: event.description,
    path: `/events/${event.slug}`,
  });
}

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const events = await loadPublishedEvents();
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();

  const jsonLd = event.startsAt
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.paragraphs.join(" "),
        startDate: event.startsAt,
        ...(event.endsAt ? { endDate: event.endsAt } : {}),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        ...(event.imageUrl ? { image: [absoluteAsset(event.imageUrl)] } : {}),
        url: pageUrl(`/events/${event.slug}`),
        location: {
          "@type": "Place",
          name: event.venue || event.city,
          address: event.address || event.city,
        },
        organizer: { "@type": "Organization", name: siteName, url: pageUrl("/") },
      }
    : webPageJsonLd(event.title, `/events/${event.slug}`, event.description);

  return (
    <main className="event-detail">
      <JsonLd data={jsonLd} />
      <section className={event.imageUrl ? "event-detail-hero" : "event-detail-hero event-detail-plain"}>
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt="Guests dancing and toasting at the bar during Curated Nights"
            fill
            priority
            sizes="100vw"
          />
        )}
        {event.imageUrl && <div className="hero-overlay" />}
        <div className="event-detail-title">
          <p className="kicker">{event.past ? "Past night" : "Up next"}</p>
          <h1>{event.title}</h1>
          <p className="edition">{event.placeLine}</p>
        </div>
      </section>
      <section className="event-detail-body">
        <div>
          {event.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={index === 0 ? "lead" : undefined}>{paragraph}</p>
          ))}
          {event.photos.length > 0 && <PhotoMosaic photos={event.photos} label={event.title} />}
          {!event.past && (
            <p className="small-note">No dress code. This event is strictly 18+ and valid photo ID is required. Humanitix lists a no-refunds policy.</p>
          )}
        </div>
        <aside>
          <p><CalendarDays /> {event.placeLine}</p>
          {!event.past && <p><Clock3 /> 9:30 PM–3:00 AM NZDT</p>}
          {event.venue && <p><MapPin /> {event.venue}{event.address && <><br />{event.address}</>}</p>}
          {event.ticketUrl && (
            <a className="button" href={event.ticketUrl} target="_blank" rel="noreferrer"><Ticket size={18} /> Buy on Humanitix ↗</a>
          )}
        </aside>
      </section>
    </main>
  );
}
