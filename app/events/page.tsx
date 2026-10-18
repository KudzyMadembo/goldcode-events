import Image from "next/image";
import Link from "next/link";
import { ContactStrip } from "@/components/contact-strip";
import { JsonLd } from "@/components/json-ld";
import { doorsLabel, featuredEvent, loadPublishedEvents } from "@/lib/catalog";
import { assetPath } from "@/lib/paths";
import { pageMetadata, webPageJsonLd } from "@/lib/site";
import type { GoldCodeEvent } from "@/lib/types";

const title = "Our events in Auckland | GoldCode Events";
const description =
  "GoldCode events in Auckland: Curated Nights, Holy Ten Live at Cassette Nine, and The Link Up Winter and Spring editions of Africa to Aotearoa.";

export const metadata = pageMetadata({ title, description, path: "/events" });

function splitPlaceLine(placeLine: string) {
  const [first, second] = placeLine.split("|").map((part) => part.trim());
  return second ? { date: first, place: second } : { date: "", place: first };
}

function dateParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-NZ", { timeZone: "Pacific/Auckland", weekday: "long", day: "numeric", month: "long", year: "numeric" }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { weekday: get("weekday"), day: get("day"), month: get("month"), year: get("year") };
}

function PastNight({ event }: { event: GoldCodeEvent }) {
  const { date, place } = splitPlaceLine(event.placeLine);
  const strip = event.photos.slice(0, 3);
  return (
    <article className="past-night" id={event.slug}>
      <div className="past-night-meta">
        {date && <p className="past-night-date">{date}</p>}
        <p className="past-night-place">{place}</p>
      </div>
      <div className="past-night-body">
        <h3><Link href={`/events/${event.slug}`}>{event.title}</Link></h3>
        {event.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {strip.length > 0 && (
          <Link className="past-night-strip" href={`/events/${event.slug}#photos`} aria-label={`See all ${event.photos.length} photographs from ${event.title}`}>
            {strip.map((photo, index) => (
              <span key={photo.id} className={index === 0 ? "wide" : undefined}>
                <Image src={photo.src} alt={photo.alt} fill sizes={index === 0 ? "(max-width: 800px) 100vw, 40vw" : "(max-width: 800px) 50vw, 20vw"} />
              </span>
            ))}
            <span className="strip-more">{event.photos.length} photographs <em>→</em></span>
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const events = await loadPublishedEvents();
  const featured = featuredEvent(events);
  const past = events.filter((event) => event !== featured);
  const when = featured?.startsAt ? dateParts(featured.startsAt) : null;
  const doors = featured ? doorsLabel(featured) : "";
  const cover = assetPath("/images/gallery/cn-9218.jpg");

  return (
    <main className="events-page">
      <JsonLd data={webPageJsonLd(title, "/events", description)} />
      <section className="events-hero">
        <Image src={cover} alt="Guests with their hands in the air beside the Curated Nights sign" fill loading="eager" fetchPriority="high" sizes="100vw" />
        <div className="events-hero-shade" />
        <div className="events-hero-copy">
          <h1>Our Events</h1>
          <p>African music, played loud, in rooms across Auckland. The nights so far, and the one coming up.</p>
        </div>
      </section>

      {featured && (
        <section className="next-night" id={featured.slug}>
          {when && (
            <div className="next-night-date" aria-hidden="true">
              <span className="day">{when.day}</span>
              <span className="month">{when.month}</span>
              <span className="year">{when.year}</span>
            </div>
          )}
          <div className="next-night-copy">
            <p className="next-night-eyebrow">Up next{when ? ` · ${when.weekday}` : ""}</p>
            <h2><Link href={`/events/${featured.slug}`}>{featured.title}</Link></h2>
            <p className="next-night-meta">
              {featured.venue && <span>{featured.venue}{featured.city ? `, ${featured.city}` : ""}</span>}
              {doors && <span>Doors {doors}</span>}
              {featured.ageRestriction && <span>{featured.ageRestriction}</span>}
            </p>
            {featured.paragraphs.slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="next-night-actions">
              {featured.ticketUrl && <a className="button" href={featured.ticketUrl} target="_blank" rel="noreferrer">Get tickets <span>↗</span></a>}
              <Link className="text-link" href={`/events/${featured.slug}`}>Event details</Link>
            </div>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="past-nights">
          <h2>Past nights</h2>
          {past.map((event) => <PastNight key={event.id} event={event} />)}
          <p className="event-signoff">Uniting cultures through music.</p>
        </section>
      )}
      <ContactStrip />
    </main>
  );
}
