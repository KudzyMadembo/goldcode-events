import { EventCard } from "@/components/event-card";
import { ContactStrip } from "@/components/contact-strip";
import { seedEvents } from "@/lib/events";

export const metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <main>
      <section className="page-intro"><p className="kicker">GoldCode calendar</p><h1>Come for the sound.<br />Stay for the feeling.</h1><p>Upcoming GoldCode experiences, from our signature Africa to Aotearoa series to new concepts still to come.</p></section>
      <section className="events-list"><div className="section-title"><p className="kicker">Upcoming</p><span>01 event</span></div>{seedEvents.map((event) => <EventCard key={event.id} event={event} />)}</section>
      <section className="archive-empty"><p className="kicker">Event archive</p><h2>The nights we’ve made together.</h2><p>Photography and details from previous GoldCode events will appear here as the archive grows.</p></section>
      <ContactStrip />
    </main>
  );
}
