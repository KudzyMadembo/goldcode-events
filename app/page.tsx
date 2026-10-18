import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, MapPin, Music2 } from "@/components/icons";
import { ContactStrip } from "@/components/contact-strip";
import { JsonLd } from "@/components/json-ld";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { doorsLabel, featuredEvent, illustratedPastEvent, loadPublishedEvents } from "@/lib/catalog";
import { formatEventDate, formatEventDateShort, statusLabels } from "@/lib/events";
import { assetPath } from "@/lib/paths";
import { homeDescription, homeTitle, pageMetadata, pageUrl, siteName, siteUrl } from "@/lib/site";

export const metadata = pageMetadata({ title: homeTitle, description: homeDescription, path: "/" });

export default async function Home() {
  const events = await loadPublishedEvents();
  const featured = featuredEvent(events);
  const illustrated = illustratedPastEvent(events);
  const doors = featured ? doorsLabel(featured) : "";
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: siteName,
              url: pageUrl("/"),
              email: "inquiry@goldcodeevents.com",
              logo: `${siteUrl}/images/goldcode-logo.png`,
              sameAs: ["https://www.instagram.com/goldcode.events", "https://www.tiktok.com/@goldcode.events"],
            },
            {
              "@type": "WebSite",
              name: siteName,
              url: pageUrl("/"),
              description: homeDescription,
            },
          ],
        }}
      />
      <section className="hero">
        <Image className="hero-image" src={assetPath("/images/gallery/cn-9218.jpg")} alt="Guests with their hands in the air at a GoldCode Curated Nights party" fill priority sizes="100vw" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="kicker">Auckland · Aotearoa</p>
          <h1>Uniting cultures<br />through music.</h1>
          <p className="hero-lede">African sounds. Unforgettable nights. One community.</p>
          <div className="hero-actions">
            {featured?.ticketUrl && <a className="button" href={featured.ticketUrl} target="_blank" rel="noreferrer">Get tickets <span>↗</span></a>}
            <Link className="text-link light" href="/events">Explore events <ArrowRight size={18} /></Link>
          </div>
        </div>
        <p className="hero-signature"><Music2 size={15} /> GoldCode Events</p>
      </section>

      {featured && (
      <section className="featured-event">
        <div className="event-visual">
          <strong aria-hidden="true">GC</strong>
          <div className="ticket-wrap">
            {featured.ticketUrl ? (
            <a className="ticket" href={featured.ticketUrl} target="_blank" rel="noreferrer" aria-label={`Buy tickets for ${featured.series ?? featured.name}: ${featured.name} on Humanitix`}>
              <div className="ticket-body">
                <p className="ticket-presents">GoldCode Events presents</p>
                <p className="ticket-title">{featured.series ?? featured.name}</p>
                <p className="ticket-edition">{featured.name}</p>
                <dl className="ticket-facts">
                  {featured.startsAt && <div><dt>Date</dt><dd>{formatEventDateShort(featured.startsAt)}</dd></div>}
                  {doors && <div><dt>Doors</dt><dd>{doors.split("–")[0]}</dd></div>}
                  {featured.venue && <div><dt>Venue</dt><dd>{featured.venue}</dd></div>}
                </dl>
              </div>
              <div className="ticket-stub">
                <span className="ticket-cta">Buy tickets<small>On Humanitix</small></span>
                <span className="ticket-arrow"><ArrowUpRight size={18} /></span>
              </div>
            </a>
            ) : null}
          </div>
        </div>
        <div className="event-copy">
          <p className="kicker"><span className="pulse" /> Up next</p>
          <p className="series-name">GoldCode Events presents</p>
          <h2>{featured.series ?? featured.name}</h2>
          <p className="edition">{featured.name}</p>
          <p className="event-description">{featured.paragraphs[0]}</p>
          <div className="event-facts">
            {featured.startsAt && <p><CalendarDays size={18} /> {formatEventDate(featured.startsAt)}</p>}
            {doors && <p><Clock3 size={18} /> {doors}</p>}
            {featured.venue && <p><MapPin size={18} /> {featured.venue}{featured.city ? `, ${featured.city}` : ""}</p>}
          </div>
          <div className="event-actions">
            {featured.ticketUrl && <a className="button" href={featured.ticketUrl} target="_blank" rel="noreferrer">Get tickets <span>↗</span></a>}
            <span className="availability">{statusLabels[featured.status]}</span>
          </div>
        </div>
      </section>
      )}

      <section className="home-story">
        <div><p className="kicker">Our story</p><h2>More than<br />a night out.</h2></div>
        <div className="story-copy"><p className="lead">GoldCode creates spaces where African music feels at home in Aotearoa.</p><p>Our nights bring people together across borders and backgrounds, celebrating the sounds moving the continent and its diaspora.</p><Link className="text-link" href="/about">Discover GoldCode <ArrowRight size={18} /></Link></div>
      </section>

      {illustrated && (
      <section className="home-gallery">
        <div className="gallery-image">
          <Image src={illustrated.photos[0].src} alt={illustrated.photos[0].alt} fill sizes="70vw" />
          <div><p className="kicker">Past events</p><h2>{illustrated.title}</h2><Link href="/gallery">View the gallery →</Link></div>
        </div>
        <PhotoMosaic photos={illustrated.photos} label={illustrated.title} />
      </section>
      )}
      <ContactStrip />
    </main>
  );
}
