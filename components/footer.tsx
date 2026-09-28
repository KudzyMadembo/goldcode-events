import Link from "next/link";
import { Camera } from "./icons";

export function Footer() {
  return (
    <footer>
      <div>
        <p className="footer-mark">GoldCode</p>
        <p className="footer-submark">Events</p>
      </div>
      <p className="footer-statement">African sounds.<br />Aotearoa nights.</p>
      <div className="footer-links">
        <a href="https://www.instagram.com/goldcode.events" target="_blank" rel="noreferrer"><Camera size={17} /> Instagram</a>
        <a href="https://www.tiktok.com/@goldcode.events" target="_blank" rel="noreferrer">TikTok ↗</a>
        <a href="https://www.facebook.com/share/1DwJkxJFRu/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook ↗</a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GoldCode Events</span>
        <Link href="/admin">Admin</Link>
      </div>
    </footer>
  );
}
