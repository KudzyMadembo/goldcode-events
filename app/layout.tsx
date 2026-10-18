import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { featuredEvent, loadPublishedEvents } from "@/lib/catalog";
import { homeTitle, siteUrl } from "@/lib/site";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: homeTitle, template: "%s | GoldCode Events" },
  icons: { icon: `${siteUrl}/favicon.svg` },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const events = await loadPublishedEvents();
  const featured = featuredEvent(events);
  return (
    <html lang="en">
      <body><Header ticketUrl={featured?.ticketUrl ?? ""} />{children}<Footer /></body>
    </html>
  );
}
