import type { Metadata } from "next";
import { AnalyticsScripts } from "./analytics";
import { siteName, siteUrl } from "./site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shopify Inventory CSV Checker - Check Stock Import Risks",
    template: "%s | Shopify Inventory CSV Checker"
  },
  description:
    "Check Shopify inventory CSV files before import. Find SKU, Location, On hand current/new, duplicate rows, and overwrite risks locally in your browser.",
  openGraph: {
    title: "Shopify Inventory CSV Checker",
    description:
      "Compare original and edited Shopify inventory CSV files before import. Find stock overwrite risks locally in your browser.",
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Shopify Inventory CSV Checker preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Inventory CSV Checker",
    description:
      "Check On hand current/new, SKU, Location, duplicate rows, and inventory overwrite risks before Shopify CSV import.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
