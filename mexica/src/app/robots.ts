import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/order/status"] }],
    sitemap: abs("/sitemap.xml"),
    host: abs("/"),
  };
}
