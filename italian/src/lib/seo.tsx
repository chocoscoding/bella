import { restaurant as r } from "./restaurant";
import { siteUrl } from "./site";

/** Site-wide SEO constants. Everything that ends up in metadata or JSON-LD reads from here. */
export const site = {
  name: "Bella Cucina of the Lake",
  shortName: "Bella Cucina",
  tagline: "Italian Restaurant in Locust Grove, VA",
  description:
    "Pasta, pizza and Italian classics on Germanna Highway in Locust Grove, Virginia, minutes from Lake of the Woods. Order online, plan catering, and read our kitchen journal.",
  locale: "en_US",
  language: "en-US",
  cuisine: ["Italian", "Pizza", "Pasta", "Seafood"],
  priceRange: "$$",
  /** Towns we realistically serve. Used for areaServed and in copy guidance. */
  areaServed: [
    "Locust Grove, VA",
    "Lake of the Woods, VA",
    "Wilderness, VA",
    "Orange County, VA",
    "Spotsylvania County, VA",
    "Fredericksburg, VA",
    "Culpeper, VA",
  ],
  sameAs: [r.facebookUrl, r.googleRating.url],
  defaultImage: "/images/italian-shared-table.webp",
  blogName: "The Bella Cucina Journal",
  blogDescription:
    "Italian food guides, catering tips and local favorites from Bella Cucina of the Lake in Locust Grove, Virginia.",
};

/** Absolute URL for a site path. */
export const abs = (path = "/") => new URL(path, siteUrl).toString();

export const ids = {
  restaurant: abs("/#restaurant"),
  website: abs("/#website"),
  blog: abs("/blog#blog"),
};

type Json = Record<string, unknown>;

export function restaurantSchema(): Json {
  return {
    "@type": "Restaurant",
    "@id": ids.restaurant,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: abs("/"),
    logo: abs("/images/logo.webp"),
    image: [abs(site.defaultImage), abs("/images/exterior.webp"), abs("/images/hero-pizza-fork.png")],
    telephone: r.phoneHref.replace("tel:", ""),
    priceRange: site.priceRange,
    servesCuisine: site.cuisine,
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address,
      addressLocality: r.city,
      addressRegion: r.region,
      postalCode: r.postalCode,
      addressCountry: "US",
    },
    hasMap: r.googleRating.url,
    hasMenu: abs(r.officialMenuUrl),
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: r.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: site.sameAs,
    potentialAction: {
      "@type": "OrderAction",
      target: { "@type": "EntryPoint", urlTemplate: abs(r.orderUrl), actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"] },
      deliveryMethod: "https://purl.org/goodrelations/v1#DeliveryModePickUp",
    },
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: abs("/"),
    name: site.name,
    alternateName: site.shortName,
    inLanguage: site.language,
    publisher: { "@id": ids.restaurant },
  };
}

export function breadcrumbSchema(items: [name: string, path: string][]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

/** Renders one or more schema.org nodes as a single JSON-LD @graph. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  const graph = { "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
