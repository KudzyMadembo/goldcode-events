import Image from "next/image";
import { ContactStrip } from "@/components/contact-strip";
import { JsonLd } from "@/components/json-ld";
import { assetPath } from "@/lib/paths";
import { pageMetadata, webPageJsonLd } from "@/lib/site";

const title = "About GoldCode in Auckland | GoldCode Events";
const description =
  "GoldCode Events is an Auckland company creating premium nights where African music meets Aotearoa. Africa to Aotearoa is the signature series. All cultures welcome.";

export const metadata = pageMetadata({ title, description, path: "/about" });

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={webPageJsonLd(title, "/about", description)} />
      <section className="page-intro about-intro"><p className="kicker">About GoldCode</p><h1>Africa in the sound.<br />Aotearoa in the room.</h1><p>GoldCode Events is an Auckland-based entertainment company creating premium live experiences through music, culture and unforgettable events.</p></section>
      <section className="manifesto"><div className="manifesto-image"><Image src={assetPath("/images/gallery/cn-9231.jpg")} alt="A guest laughing with friends at a GoldCode night" fill priority sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="manifesto-copy"><p className="kicker">Why we gather</p><h2>Music travels.<br />Culture connects.</h2><p className="lead">We believe a great event can make a city feel smaller and the world feel closer.</p><p>Our mission is to unite cultures through music and bring world-class entertainment to Aotearoa. Africa to Aotearoa is our signature series: a home for Afrobeats, Amapiano, Afro Sungura, Dancehall, R&B, Hip Hop and the sounds that sit between them.</p></div></section>
      <section className="values"><article><h3>Culture first</h3><p>Every detail starts with respect for the music and the communities carrying it.</p></article><article><h3>Premium, not distant</h3><p>Beautiful rooms, thoughtful production and a welcome that feels genuine.</p></article><article><h3>Open to everyone</h3><p>Rooted in African sound and made for every culture ready to move together.</p></article></section>
      <ContactStrip />
    </main>
  );
}
