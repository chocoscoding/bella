import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDate, getAllPosts, getPost, headings, plain, readingMinutes, relatedPosts, wordCount } from "@/lib/blog";
import { JsonLd, abs, breadcrumbSchema, ids, site } from "@/lib/seo";
import { ArticleBody, Inline } from "@/components/blog/rich-text";
import { PostCard } from "@/components/blog/post-card";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { Action } from "@/components/brand";
import { restaurant as r } from "@/lib/restaurant";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  const title = post.seoTitle ?? post.title;
  return {
    ...(post.draft && { robots: { index: false, follow: false } }),
    title: { absolute: title },
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author.name, url: post.author.url }],
    category: post.category,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: site.blogName }] },
    },
    openGraph: {
      type: "article",
      url,
      title,
      description: post.description,
      siteName: site.name,
      locale: site.locale,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
      authors: [post.author.name],
      section: post.category,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description: post.description },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const url = abs(`/blog/${post.slug}`);
  const toc = headings(post);
  const related = relatedPosts(post);
  const modified = post.dateModified && post.dateModified !== post.datePublished ? post.dateModified : null;

  const article = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    alternativeHeadline: post.seoTitle,
    description: post.description,
    image: [abs(post.cover.src), abs(`/blog/${post.slug}/opengraph-image`)],
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: post.author.url
      ? { "@type": "Person", name: post.author.name, url: post.author.url, jobTitle: post.author.role }
      : { "@type": "Organization", name: post.author.name, url: abs("/") },
    publisher: { "@id": ids.restaurant },
    isPartOf: { "@id": ids.blog },
    about: { "@id": ids.restaurant },
    articleSection: post.category,
    keywords: post.keywords.join(", "),
    wordCount: wordCount(post),
    timeRequired: `PT${readingMinutes(post)}M`,
    inLanguage: site.language,
  };
  const faq = post.faqs?.length
    ? {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
        })),
      }
    : null;

  return (
    <main id="main" className="blog-page article-page">
      <JsonLd
        data={[
          article,
          breadcrumbSchema([["Home", "/"], ["Blog", "/blog"], [post.title, `/blog/${post.slug}`]]),
          ...(faq ? [faq] : []),
        ]}
      />
      <article>
        <header className="article-hero">
          <Breadcrumbs items={[["Home", "/"], ["Blog", "/blog"], [post.title]]} />
          <span className="eyebrow">{post.draft && <mark className="draft-flag">Draft · not published</mark>}{post.category}</span>
          <h1>{post.title}</h1>
          <p className="article-dek">{post.excerpt}</p>
          <p className="article-meta">
            By {post.author.name} · <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
            {modified && (
              <>
                {" "}· Updated <time dateTime={modified}>{formatDate(modified)}</time>
              </>
            )}{" "}
            · {readingMinutes(post)} min read
          </p>
        </header>
        <div className="page-panels">
          <figure className="article-cover">
            <Image src={post.cover.src} alt={post.cover.alt} width={post.cover.width} height={post.cover.height} sizes="(max-width:1000px) 95vw, 1200px" priority />
          </figure>
          <div className="panel article-panel">
            {toc.length > 2 && (
              <nav className="article-toc" aria-labelledby="toc-title">
                <span className="eyebrow" id="toc-title">On this page</span>
                <ol>
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                  {post.faqs?.length ? (
                    <li>
                      <a href="#faq">Questions</a>
                    </li>
                  ) : null}
                </ol>
              </nav>
            )}
            <div className="article-body">
              <ArticleBody blocks={post.body} />
              {post.faqs?.length ? (
                <section className="article-faq" aria-labelledby="faq">
                  <h2 id="faq">Good questions</h2>
                  {post.faqs.map((f, i) => (
                    <details key={f.q} open={i === 0}>
                      <summary>{f.q}</summary>
                      <p>
                        <Inline text={f.a} />
                      </p>
                    </details>
                  ))}
                </section>
              ) : null}
              <footer className="article-author">
                <span className="eyebrow">Written by</span>
                <strong>{post.author.name}</strong>
                {post.author.role && <span>{post.author.role}</span>}
                <p>
                  Find us at {r.address}, {r.locality}, or call <a href={r.phoneHref}>{r.phone}</a>.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </article>
      <div className="page-panels">
        {related.length > 0 && (
          <section className="panel blog-shelf" aria-labelledby="related-title">
            <h2 id="related-title">Keep reading</h2>
            <div className="post-grid">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} headingLevel="h3" />
              ))}
            </div>
          </section>
        )}
        <section className="panel blog-cta">
          <span className="eyebrow">Locust Grove, Virginia</span>
          <h2>Hungry yet?</h2>
          <p>Order for pickup, plan a party, or just stop by. We open at 11 am every day.</p>
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
