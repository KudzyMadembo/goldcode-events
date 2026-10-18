import type { Metadata } from "next";
import { basePath } from "./paths";

export const siteName = "GoldCode Events";

/** Production origin: the Cloudflare zone for the registered domain. */
export const siteUrl = "https://goldcodeevents.com";

export const homeTitle = "Uniting cultures through music | GoldCode Events";
export const homeDescription =
  "GoldCode Events hosts premium African music nights in Auckland, uniting cultures through Afrobeats, Amapiano, Dancehall and the Africa to Aotearoa series.";

export const pageUrl = (path = "/") => {
  if (path === "/" || path === "") return `${siteUrl}/`;
  return `${siteUrl}/${path.replace(/^\/+|\/+$/g, "")}/`;
};

export const absoluteAsset = (src: string) => {
  const path = basePath && src.startsWith(basePath) ? src.slice(basePath.length) : src;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const shareImage = `${siteUrl}/images/og.jpg`;
const shareImageAlt = "Guests dancing with their hands up at a GoldCode night in Auckland";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = pageUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName,
      url,
      title,
      description,
      images: [{ url: shareImage, width: 1200, height: 630, alt: shareImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export function webPageJsonLd(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: pageUrl(path),
    isPartOf: { "@type": "WebSite", name: siteName, url: pageUrl("/") },
  };
}
