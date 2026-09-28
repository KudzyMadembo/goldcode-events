"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "./icons";
import { assetPath } from "@/lib/paths";

const links = [
  ["/events", "Events"],
  ["/about", "About"],
  ["/gallery", "Gallery"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header" style={pathname.startsWith("/admin") ? { background: "#07110f" } : undefined}>
      <Link className="brand" href="/" aria-label="GoldCode Events home">
        <Image src={assetPath("/images/goldcode-logo.png")} alt="GoldCode Events" width={120} height={120} priority />
      </Link>
      <nav className={open ? "nav-open" : ""} aria-label="Primary navigation">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
        <a className="mobile-contact" href="https://wa.me/64212166539?text=Hi%20GoldCode%20Events%2C%20I%27m%20getting%20in%20touch%20about%20an%20event%20or%20collaboration.">Contact</a>
      </nav>
      <a className="button header-cta" href="https://events.humanitix.com/africa-to-aotearoa-the-link-up-spring-heat" target="_blank" rel="noreferrer">
        Get tickets <span>↗</span>
      </a>
      <button className="menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
