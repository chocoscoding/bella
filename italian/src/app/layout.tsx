import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import { site } from "@/lib/seo";
const krisha = localFont({
  src: "../../public/fonts/Krisha-Regular.otf",
  variable: "--font-display",
  display: "swap",
});
const jua = localFont({
  src: "../../public/fonts/Jua-Regular.ttf",
  variable: "--font-body",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Bella Cucina of the Lake | Italian Restaurant in Locust Grove, VA",
    template: "%s | Bella Cucina of the Lake",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Italian restaurant Locust Grove VA",
    "pizza Locust Grove",
    "pasta near Lake of the Woods",
    "Italian food Orange County VA",
    "Italian catering Locust Grove",
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: site.blogName }] },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: "Bella Cucina of the Lake | Italian Restaurant in Locust Grove, VA",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${krisha.variable} ${jua.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
