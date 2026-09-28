import Image from "next/image";
import { ContactStrip } from "@/components/contact-strip";

export const metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <main>
      <section className="page-intro gallery-intro"><p className="kicker">The energy</p><h1>Moments that stay.</h1><p>GoldCode is built in the room: the first track, the full dance floor, and the conversations that carry on after the lights come up.</p></section>
      <section className="gallery-board"><figure className="gallery-feature"><Image src="/images/goldcode-hero.png" alt="Guests dancing at a GoldCode event" fill sizes="70vw" /><figcaption>GoldCode atmosphere · Preview image</figcaption></figure><div className="photo-placeholder motif-one"><span>Real event photography coming soon</span></div><div className="photo-placeholder motif-two"><span>DJs · Crowd · Culture</span></div></section>
      <p className="gallery-disclaimer">Preview imagery will be replaced with photography from GoldCode’s own events before public launch.</p>
      <ContactStrip />
    </main>
  );
}
