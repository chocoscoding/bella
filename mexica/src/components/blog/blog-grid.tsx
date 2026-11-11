"use client";

import { useState } from "react";
import type { PostSummary } from "@/lib/blog";
import { PostCard } from "./post-card";

/** Every post in one grid, newest first, with tag chips that filter it. All cards are server-rendered. */
export function BlogGrid({ posts }: { posts: PostSummary[] }) {
  const tags = [...new Set(posts.map((p) => p.category))];
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? posts.filter((p) => p.category === active) : posts;
  const chip = (label: string, value: string | null, count: number) => (
    <li key={label}>
      <button type="button" className="blog-tag" aria-pressed={active === value} onClick={() => setActive(value)}>
        {label} <span>{count}</span>
      </button>
    </li>
  );

  return (
    <section className="blog-all" aria-label="All stories">
      {tags.length > 1 && (
        <ul className="blog-tags" aria-label="Filter by tag">
          {chip("All", null, posts.length)}
          {tags.map((t) => chip(t, t, posts.filter((p) => p.category === t).length))}
        </ul>
      )}
      <div className="post-grid" aria-live="polite">
        {shown.map((p, i) => (
          <PostCard key={p.slug} post={p} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
