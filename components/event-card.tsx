import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "./icons";
import { GoldCodeEvent } from "@/lib/types";

export function EventCard({ event, priority = false }: { event: GoldCodeEvent; priority?: boolean }) {
  return (
    <article className="event-card">
      {event.imageUrl && (
        <div className="event-card-image">
          <Image src={event.imageUrl} alt="Guests dancing and toasting at the bar during Curated Nights" fill priority={priority} sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
      )}
      <div className="event-card-body">
        <p className="kicker">{event.past ? "Past night" : "GoldCode Events presents"}</p>
        <h2>{event.title}</h2>
        <p className="meta"><CalendarDays size={17} /> {event.placeLine}</p>
        <p>{event.paragraphs[0]}</p>
        <div className="card-actions">
          <Link className="text-link" href={`/events/${event.slug}`}>Event details <span>→</span></Link>
          {event.ticketUrl && <a className="button" href={event.ticketUrl} target="_blank" rel="noreferrer">Get tickets <span>↗</span></a>}
        </div>
      </div>
    </article>
  );
}
