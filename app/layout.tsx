import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GoldCode Events | Uniting cultures through music", template: "%s | GoldCode Events" },
  description: "Premium African music events connecting cultures across Aotearoa.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><Header />{children}<Footer /></body>
    </html>
  );
}
