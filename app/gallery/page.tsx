import Image from "next/image";
import { ContactStrip } from "@/components/contact-strip";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { JsonLd } from "@/components/json-ld";
import { galleryGroups, loadPublishedEvents } from "@/lib/catalog";
import { assetPath } from "@/lib/paths";
import { pageMetadata, webPageJsonLd } from "@/lib/site";

const title = "Curated Nights photo gallery | GoldCode Events";
const description =
  "Photographs from GoldCode presents Curated Nights in Auckland, from the dance floor and the decks to the conversations after the lights come up.";

export const metadata = pageMetadata({ title, description, path: "/gallery" });

export default async function GalleryPage() {
  const groups = galleryGroups(await loadPublishedEvents());
  const hero = groups[0]?.photos[0];
  return (
    <main>
      <JsonLd data={webPageJsonLd(title, "/gallery", description)} />
      <section className="gallery-hero">
        <Image
          src={hero ? hero.src : assetPath("/images/gallery/cn-9219.jpg")}
          alt={hero?.alt ?? "Guests dancing at a GoldCode night"}
          fill
          priority
          sizes="100vw"
        />
        <div className="gallery-hero-shade" />
        <div className="gallery-hero-copy">
          <p className="kicker">The gallery</p>
          <h1>Moments<br />that stay.</h1>
          <p className="gallery-lede">
            GoldCode is built in the room: the first track, the full dance floor, and the conversations that carry on after the lights come up.
          </p>
        </div>
        <dl className="gallery-meta">
          <div><dt>Nights</dt><dd>{groups.length ? groups.map((event) => event.name).join(" · ") : "Photographs appear after a night"}</dd></div>
          <div><dt>City</dt><dd>Auckland</dd></div>
        </dl>
      </section>
      <section className="event-chronicle">
        {groups.map((event) => (
          <article className="gallery-group" key={event.id}>
            <h2>{event.title}</h2>
            <p className="place-line">{event.placeLine}</p>
            <PhotoMosaic photos={event.photos} label={event.title} />
          </article>
        ))}
      </section>
      <ContactStrip />
    </main>
  );
}
