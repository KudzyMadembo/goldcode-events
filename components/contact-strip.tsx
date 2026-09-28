import { Mail, Phone } from "./icons";

export function ContactStrip() {
  return (
    <section className="contact-strip">
      <div>
        <p className="kicker">Work with GoldCode</p>
        <h2>Artists. Agents.<br />Venues. Collaborators.</h2>
      </div>
      <div className="contact-actions">
        <p>Have an artist, a room, or an idea worth bringing to life? Let’s talk.</p>
        <a className="button dark-button" href="https://wa.me/64212166539?text=Hi%20GoldCode%20Events%2C%20I%27m%20getting%20in%20touch%20about%20an%20event%20or%20collaboration." target="_blank" rel="noreferrer"><Phone size={18} /> WhatsApp us</a>
        <a className="secondary-contact" href="mailto:inquiry@goldcodeevents.com"><Mail size={17} /> inquiry@goldcodeevents.com</a>
      </div>
    </section>
  );
}
