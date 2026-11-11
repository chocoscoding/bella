import { getAllPosts, plain } from "@/lib/blog";
import { abs, site } from "@/lib/seo";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${abs(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${abs(`/blog/${p.slug}`)}</guid>
      <description>${esc(plain(p.description))}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${new Date(`${p.datePublished}T12:00:00Z`).toUTCString()}</pubDate>
      <enclosure url="${abs(p.cover.src)}" type="image/${p.cover.src.split(".").pop() === "jpg" ? "jpeg" : p.cover.src.split(".").pop()}" length="0" />
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.blogName)}</title>
    <link>${abs("/blog")}</link>
    <description>${esc(site.blogDescription)}</description>
    <language>${site.language}</language>
    <atom:link href="${abs("/blog/rss.xml")}" rel="self" type="application/rss+xml" />
    ${posts[0] ? `<lastBuildDate>${new Date(`${posts[0].dateModified ?? posts[0].datePublished}T12:00:00Z`).toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
