import type { Metadata } from "next";
import { getAllPosts, summarize } from "@/lib/blog";
import { JsonLd, abs, breadcrumbSchema, ids, site } from "@/lib/seo";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { Action } from "@/components/brand";
import { restaurant as r } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: { absolute: "Mexican Food Blog & Local Guides | Bella Cucina Mexican" },
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
      </header>
      <div className="page-panels">
        <BlogGrid posts={posts.map(summarize)} />
        <section className="panel blog-cta">
          <span className="eyebrow">Hungry after all that reading?</span>
          <h2>Pull up a chair.</h2>
          <p>Order your favorites for pickup, or tell us about the gathering you are planning.</p>
          <div className="blog-cta-actions">
            <Action href={r.order}>Order online</Action>
            <Action href={r.catering} light>
              Plan catering
            </Action>
          </div>
        </section>
      </div>
    </main>
  );
}
