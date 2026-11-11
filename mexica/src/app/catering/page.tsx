import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { restaurant as r } from "@/lib/restaurant";
import { JsonLd, abs, breadcrumbSchema, ids, site } from "@/lib/seo";
import { OrderHeader } from "@/ordering/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Action } from "@/components/brand";
import "@/ordering/theme.css";
import "./catering.css";

const title = "Mexican Catering in Locust Grove, VA | Bella Cucina Mexican";
const description =
  "Mexican catering from Bella Cucina Mexican: tacos, loaded nachos and generous plates for birthdays, office lunches and parties in Locust Grove and Lake of the Woods. Call (540) 412-5009.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: ["Mexican catering Locust Grove VA", "taco catering Lake of the Woods", "taco bar catering", "party catering Orange County VA", "office lunch catering Fredericksburg"],
  alternates: { canonical: "/catering" },
  openGraph: { type: "website", url: "/catering", title, description, siteName: site.name, locale: site.locale },
  twitter: { card: "summary_large_image", title, description },
};

export default function Catering() {
  return (
    <div className="mx-inner">
      <a className="skip" href="#main">Skip to content</a>
      <OrderHeader />
      <main id="main" className="mx-catering">
        <JsonLd
          data={[
            {
              "@type": "Service",
              "@id": abs("/catering#service"),
              name: "Mexican catering",
              serviceType: "Catering",
              description,
              url: abs("/catering"),
              image: abs(site.defaultImage),
              provider: { "@id": ids.restaurant },
              areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
              availableChannel: {
                "@type": "ServiceChannel",
                servicePhone: { "@type": "ContactPoint", telephone: r.phoneHref.replace("tel:", ""), contactType: "catering", areaServed: "US", availableLanguage: ["English", "Spanish"] },
                serviceLocation: { "@id": ids.restaurant },
              },
            },
            breadcrumbSchema([["Home", "/"], ["Catering", "/catering"]]),
          ]}
        />
        <section className="mx-catering-splash" aria-labelledby="catering-title">
          <Image
            src="/images/catering-celebration.webp"
            alt="Friends celebrating a birthday with tacos and nachos in a colorful dining room"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="mx-catering-image"
          />
          <div className="mx-catering-inner">
            <div className="mx-catering-copy">
              <p className="eyebrow">BELLA CATERING ✦ LOCUST GROVE, VA</p>
              <h1 id="catering-title">
                <span className="mx-reveal-line">
                  <span>You bring the occasion.</span>
                </span>
                <span className="mx-reveal-line accent">
                  <span>We bring the flavor.</span>
                </span>
              </h1>
              <p>Mexican catering for family celebrations, office lunches and gatherings that deserve something good. Tacos, nachos and plates made for a crowd.</p>
            </div>
            <aside className="mx-catering-contact" aria-label="Contact us about catering">
              <p className="eyebrow">LET’S TALK FOOD</p>
              <a href={r.phoneHref} className="mx-catering-phone">
                {r.phone}
              </a>
              <p>Call us about your group, the occasion and what you have in mind.</p>
              <Action href={r.phoneHref}>Call to plan catering</Action>
              <div className="mx-catering-ready">
                <strong>Have ready when you call</strong>
                <ul>
                  <li>Date and pickup time</li>
                  <li>Number of guests</li>
                  <li>Any dietary needs</li>
                </ul>
              </div>
              <div className="mx-catering-where">
                <a href={r.directions}>
                  {r.address}, {r.locality} ↗
                </a>
                <span>{r.hours.map(([day, time]) => `${day} ${time}`).join(" · ")}</span>
              </div>
            </aside>
          </div>
          <Link href="/blog/mexican-catering-taco-party-guide-locust-grove" className="mx-catering-guide">
            Planning tips: how much to order per person →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
