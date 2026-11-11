import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getCategories, slugify } from "@/lib/blog";
import { JsonLd, abs, breadcrumbSchema, ids, site } from "@/lib/seo";
import { PostCard } from "@/components/blog/post-card";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { OrderLink } from "@/components/site-shell";

export const metadata: Metadata = {
  title: { absolute: "Italian Food Blog & Local Guides | Bella Cucina of the Lake" },
  description: site.blogDescription,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: site.blogName }] },
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: site.blogName,
    description: site.blogDescription,
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image", title: site.blogName, description: site.blogDescription },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;
  const shelves = getCategories()
    .map((c) => ({ name: c, id: slugify(c), posts: rest.filter((p) => p.category === c) }))
    .filter((s) => s.posts.length);
  return (
    <main id="main" className="blog-page">
      <JsonLd
        data={[
          {
            "@type": "Blog",
            "@id": ids.blog,
            url: abs("/blog"),
            name: site.blogName,
            description: site.blogDescription,
            inLanguage: site.language,
            publisher: { "@id": ids.restaurant },
            isPartOf: { "@id": ids.website },
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              "@id": abs(`/blog/${p.slug}#article`),
              url: abs(`/blog/${p.slug}`),
              headline: p.title,
              description: p.description,
              image: abs(p.cover.src),
              datePublished: p.datePublished,
              dateModified: p.dateModified ?? p.datePublished,
              author: { "@type": "Organization", name: p.author.name },
            })),
          },
          breadcrumbSchema([["Home", "/"], ["Blog", "/blog"]]),
        ]}
      />
      <header className="blog-hero">
        <Breadcrumbs items={[["Home", "/"], ["Blog"]]} />
        <span className="eyebrow">{site.blogName}</span>
        <h1>
          Stories from
          <br />
          our kitchen.
        </h1>
        <p>{site.blogDescription}</p>
        {shelves.length > 1 && (
          <ul className="blog-topics" aria-label="Topics">
            {shelves.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.name}</a>
              </li>
            ))}
          </ul>
        )}
      </header>
      <div className="page-panels">
        {lead && (
          <section aria-label="Latest story" className="blog-lead">
            <PostCard post={lead} featured />
          </section>
        )}
        {shelves.map((s) => (
          <section key={s.id} id={s.id} className="panel blog-shelf" aria-labelledby={`${s.id}-title`}>
            <h2 id={`${s.id}-title`}>{s.name}</h2>
            <div className="post-grid">
              {s.posts.map((p) => (
                <PostCard key={p.slug} post={p} headingLevel="h3" />
              ))}
            </div>
          </section>
        ))}
        <section className="panel blog-cta">
          <span className="eyebrow">Hungry after all that reading?</span>
          <h2>Pull up a chair.</h2>
          <p>Order your favorites for pickup, or tell us about the gathering you are planning.</p>
          <div className="blog-cta-actions">
            <OrderLink className="sticker sticker-yellow" />
            <Link href="/catering" className="sticker sticker-outline">
              Plan catering ↗
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
