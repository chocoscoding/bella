import { restaurant as r } from "./restaurant";
import { siteUrl } from "./site";

/** Site-wide SEO constants. Everything that ends up in metadata or JSON-LD reads from here. */
export const site = {
  name: "Bella Cucina Mexican",
  shortName: "Bella Mexican",
  tagline: "Mexican Restaurant in Locust Grove, VA",
  description:
    "Tacos, loaded nachos, burritos and generous Mexican plates on Germanna Highway in Locust Grove, Virginia, near Lake of the Woods. Order online, plan catering, and read our blog.",
  locale: "en_US",
  language: "en-US",
  cuisine: ["Mexican", "Tex-Mex", "Tacos"],
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
  sameAs: [] as string[],
  defaultImage: "/images/catering-celebration.webp",
  blogName: "The Bella Mexican Blog",
  blogDescription:
    "Taco guides, catering tips and local favorites from Bella Cucina Mexican in Locust Grove, Virginia.",
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
    image: [abs("/images/plates/tacos.jpg"), abs("/images/plates/nachos.jpg"), abs("/films/mexican-salon.jpg")],
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
    hasMap: r.directions,
    hasMenu: abs(r.menu),
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: r.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    potentialAction: {
      "@type": "OrderAction",
      target: { "@type": "EntryPoint", urlTemplate: abs(r.order), actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"] },
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
