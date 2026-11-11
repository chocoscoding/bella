import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { abs, site } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts[0]?.dateModified ?? posts[0]?.datePublished;
  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1, images: [abs("/images/plates/nachos.jpg"), abs("/images/plates/tacos.jpg"), abs("/films/mexican-salon.jpg")] },
    { url: abs("/catering"), changeFrequency: "monthly", priority: 0.9, images: [abs(site.defaultImage)] },
    { url: abs("/order"), changeFrequency: "weekly", priority: 0.8 },
    { url: abs("/blog"), lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: abs(`/blog/${p.slug}`),
      lastModified: p.dateModified ?? p.datePublished,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [abs(p.cover.src)],
    })),
  ];
}
