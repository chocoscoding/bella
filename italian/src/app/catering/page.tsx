import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { restaurant as r } from "@/lib/restaurant";
import { JsonLd, abs, breadcrumbSchema, ids, site } from "@/lib/seo";
import "./catering.css";

const title = "Italian Catering in Locust Grove, VA";
const description =
  "Italian catering from Bella Cucina of the Lake for birthdays, office lunches and lake-house weekends in Locust Grove, Lake of the Woods and nearby. Call (540) 388-4430.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Italian catering Locust Grove VA", "catering Lake of the Woods", "pasta catering", "party catering Orange County VA", "office lunch catering Fredericksburg"],
  alternates: { canonical: "/catering" },
  openGraph: { type: "website", url: "/catering", title: `${title} | ${site.name}`, description, siteName: site.name, locale: site.locale },
  twitter: { card: "summary_large_image", title, description },
};

export default function Catering() {
  return (
    <main id="main" className="catering-page">
      <JsonLd
        data={[
          {
            "@type": "Service",
            "@id": abs("/catering#service"),
            name: "Italian catering",
            serviceType: "Catering",
            description,
            url: abs("/catering"),
            image: abs(site.defaultImage),
            provider: { "@id": ids.restaurant },
            areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
            availableChannel: {
              "@type": "ServiceChannel",
              servicePhone: { "@type": "ContactPoint", telephone: r.phoneHref.replace("tel:", ""), contactType: "catering", areaServed: "US", availableLanguage: "English" },
              serviceLocation: { "@id": ids.restaurant },
            },
          },
          breadcrumbSchema([["Home", "/"], ["Catering", "/catering"]]),
        ]}
      />
      <section className="catering-splash" aria-labelledby="catering-title">
        <Image
          src="/images/italian-shared-table.webp"
          alt="Friends sharing pasta, lasagna, focaccia and antipasti around a long table"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="catering-splash-image"
        />
        <div className="catering-splash-inner">
          <div className="catering-splash-copy">
            <span className="eyebrow">Bella Cucina catering · Locust Grove, VA</span>
            <h1 id="catering-title">
              You bring
              <br />
              the people.
              <br />
              <span>We bring Italy.</span>
            </h1>
            <p>
              Italian catering for birthdays, office lunches, holidays and lake-house weekends. Pasta, pizza and the classics, made for a crowd.
            </p>
          </div>
          <aside className="catering-contact" aria-label="Contact us about catering">
            <span className="eyebrow">Let’s plan something</span>
            <a href={r.phoneHref} className="catering-phone">
              {r.phone}
            </a>
            <p>Call us and we’ll put the right menu together for your group.</p>
            <a href={r.phoneHref} className="sticker sticker-red">
              Call to plan catering ↗
            </a>
            <div className="catering-ready">
              <strong>Have ready when you call</strong>
              <ul>
                <li>Date and pickup time</li>
                <li>Number of guests</li>
                <li>Any dietary needs</li>
              </ul>
            </div>
            <div className="catering-where">
              <a href={r.directionsUrl} target="_blank" rel="noopener noreferrer">
                {r.address}, {r.locality} ↗
              </a>
              <span>
                {r.hours.map(([day, time]) => `${day} ${time}`).join(" · ")}
              </span>
            </div>
          </aside>
        </div>
        <Link href="/blog/italian-catering-party-guide-locust-grove" className="catering-guide-link">
          Planning tips: how much to order per person →
        </Link>
      </section>
    </main>
  );
}
