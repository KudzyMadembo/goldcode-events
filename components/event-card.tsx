import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "./icons";
import { formatEventDate, statusLabels } from "@/lib/events";
import { GoldCodeEvent } from "@/lib/types";

export function EventCard({ event }: { event: GoldCodeEvent }) {
  const unavailable = ["sold_out", "cancelled", "postponed"].includes(event.status);
  return (
    <article className="event-card">
      <div className="event-card-image">
        <Image src={event.imageUrl} alt="Guests dancing at a GoldCode event" fill sizes="(max-width: 800px) 100vw, 50vw" />
        <span className={`status ${event.status}`}>{statusLabels[event.status]}</span>
      </div>
      <div className="event-card-body">
        <p className="kicker">{event.series}</p>
        <h2>{event.name}</h2>
        <p className="meta"><CalendarDays size={17} /> {formatEventDate(event.startsAt)} · 9:30 PM–3:00 AM</p>
        <p className="meta"><MapPin size={17} /> {event.venue}, {event.city}</p>
        <p>{event.description}</p>
        <div className="card-actions">
          <Link className="text-link" href={`/events/${event.slug}`}>Event details <span>→</span></Link>
          {!unavailable && <a className="button" href={event.ticketUrl} target="_blank" rel="noreferrer">Get tickets <span>↗</span></a>}
        </div>
      </div>
    </article>
  );
}
