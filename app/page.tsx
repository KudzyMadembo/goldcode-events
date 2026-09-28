import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin, Music2 } from "@/components/icons";
import { ContactStrip } from "@/components/contact-strip";
import { formatEventDate, springHeat } from "@/lib/events";
import { assetPath } from "@/lib/paths";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Image className="hero-image" src={assetPath("/images/goldcode-hero.png")} alt="A joyful crowd dancing around a DJ at an elegant African music event" fill priority sizes="100vw" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="kicker">Auckland · Aotearoa</p>
          <h1>Uniting cultures<br />through music.</h1>
          <p className="hero-lede">African sounds. Unforgettable nights. One community.</p>
          <div className="hero-actions">
            <a className="button" href={springHeat.ticketUrl} target="_blank" rel="noreferrer">Get tickets <span>↗</span></a>
            <Link className="text-link light" href="/events">Explore events <ArrowRight size={18} /></Link>
          </div>
        </div>
        <p className="hero-signature"><Music2 size={15} /> GoldCode Events</p>
      </section>

      <section className="featured-event">
        <div className="event-visual"><span>AFRICA</span><div className="route-line" /><strong>GC</strong><span>AOTEAROA</span></div>
        <div className="event-copy">
          <p className="kicker"><span className="pulse" /> Up next</p>
          <p className="series-name">{springHeat.series} presents</p>
          <h2>{springHeat.name}</h2>
          <p className="event-description">{springHeat.description}</p>
          <div className="event-facts">
            <p><CalendarDays size={18} /> {formatEventDate(springHeat.startsAt)}</p>
            <p><Clock3 size={18} /> 9:30 PM–3:00 AM NZDT</p>
            <p><MapPin size={18} /> {springHeat.venue}, Auckland CBD</p>
          </div>
          <div className="event-actions">
            <a className="button" href={springHeat.ticketUrl} target="_blank" rel="noreferrer">Get tickets <span>↗</span></a>
            <span className="availability">Early Bird nearly gone</span>
          </div>
        </div>
      </section>

      <section className="home-story">
        <div><p className="kicker">Our story</p><h2>More than<br />a night out.</h2></div>
        <div className="story-copy"><p className="lead">GoldCode creates spaces where African music feels at home in Aotearoa.</p><p>Our nights bring people together across borders and backgrounds, celebrating the sounds moving the continent and its diaspora.</p><Link className="text-link" href="/about">Discover GoldCode <ArrowRight size={18} /></Link></div>
      </section>

      <section className="home-gallery">
        <div className="gallery-image"><Image src={assetPath("/images/goldcode-hero.png")} alt="GoldCode event atmosphere" fill sizes="70vw" /><div><p className="kicker">Past events</p><h2>A taste of<br />the last link up.</h2><Link href="/gallery">View the gallery →</Link></div></div>
        <div className="gallery-pattern"><span>Rhythm</span><span>Culture</span><span>Connection</span></div>
      </section>
      <ContactStrip />
    </main>
  );
}
