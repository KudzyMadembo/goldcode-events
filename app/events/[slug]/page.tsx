import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, MapPin, Ticket } from "@/components/icons";
import { formatEventDate, seedEvents, statusLabels } from "@/lib/events";

export function generateStaticParams() { return seedEvents.map((event) => ({ slug: event.slug })); }

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = seedEvents.find((item) => item.slug === slug);
  if (!event) notFound();
  return (
    <main className="event-detail">
      <section className="event-detail-hero"><Image src={event.imageUrl} alt="GoldCode event atmosphere" fill priority sizes="100vw" /><div className="hero-overlay" /><div className="event-detail-title"><p className="kicker">{event.series}</p><h1>{event.name}</h1><span className={`status ${event.status}`}>{statusLabels[event.status]}</span></div></section>
      <section className="event-detail-body"><div><p className="lead">{event.description}</p><p>All cultures are welcome. Round up your crew, bring your dancing shoes and join GoldCode Events for a premium night built around rhythm, movement and community.</p><p className="small-note">No dress code. This event is strictly 18+ and valid photo ID is required. Humanitix lists a no-refunds policy.</p></div><aside><p><CalendarDays /> {formatEventDate(event.startsAt)}</p><p><Clock3 /> 9:30 PM–3:00 AM NZDT</p><p><MapPin /> {event.venue}<br />{event.address}</p><a className="button" href={event.ticketUrl} target="_blank" rel="noreferrer"><Ticket size={18} /> Buy on Humanitix ↗</a></aside></section>
    </main>
  );
}
