import { posts } from "@/content/blog";

/**
 * Blog content model. Posts live in src/content/blog/<slug>.ts and are registered in
 * src/content/blog/index.ts. Text fields accept two inline marks:
 *   [link text](/internal-path or https://external)   and   **bold**
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "tip"; title: string; text: string }
  | { type: "image"; src: string; alt: string; width: number; height: number; caption?: string }
  | { type: "cta"; title: string; text: string; href: string; label: string };

export type Post = {
  slug: string;
  /** On-page H1. */
  title: string;
  /** <title> tag, 50–60 characters, primary keyword first. Defaults to `title`. */
  seoTitle?: string;
  /** Meta description, 140–160 characters, includes the primary keyword and a reason to click. */
  description: string;
  /** One or two sentences shown on cards and at the top of the article. */
  excerpt: string;
  category: string;
  tags: string[];
  /** Primary keyword first, then secondary and local variants. */
  keywords: string[];
  /** ISO dates, YYYY-MM-DD. */
  datePublished: string;
  dateModified?: string;
  author: { name: string; role?: string; url?: string };
  cover: { src: string; alt: string; width: number; height: number };
  body: Block[];
  faqs?: { q: string; a: string }[];
  /** Slugs of related posts. Falls back to same-category posts. */
  related?: string[];
  /**
   * Unpublished. Drafts show in `next dev` (or any build with SHOW_DRAFTS=1, marked noindex) and are
   * left out of production builds entirely: no page, blog index card, sitemap, RSS or related link.
   * To publish: delete this line, set datePublished to the publish date, and make sure the cover exists.
   */
  draft?: boolean;
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\*\*|\[|\]\([^)]*\)/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Strips inline marks for plain-text contexts (meta, JSON-LD, RSS). */
export const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "");

export const showDrafts = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "1";
const visible = posts.filter((p) => showDrafts || !p.draft);

export function getAllPosts(): Post[] {
  return [...visible].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export function getPost(slug: string) {
  return visible.find((p) => p.slug === slug);
}

export function getCategories() {
  return [...new Set(getAllPosts().map((p) => p.category))];
}

export function wordCount(post: Post) {
  const text = post.body
    .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : ""))
    .concat(post.excerpt, (post.faqs ?? []).map((f) => `${f.q} ${f.a}`).join(" "))
    .join(" ");
  return plain(text).split(/\s+/).filter(Boolean).length;
}

export const readingMinutes = (post: Post) => Math.max(1, Math.round(wordCount(post) / 225));

export function headings(post: Post) {
  return post.body.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2").map((b) => ({ id: slugify(b.text), text: plain(b.text) }));
}

export function relatedPosts(post: Post, limit = 3) {
  const all = getAllPosts().filter((p) => p.slug !== post.slug);
  const picked = (post.related ?? []).map((s) => all.find((p) => p.slug === s)).filter((p): p is Post => !!p);
  const rest = all.filter((p) => !picked.includes(p)).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category));
  return [...picked, ...rest].slice(0, limit);
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
