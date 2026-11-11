import Link from "next/link";
import Image from "next/image";
import { formatDate, readingMinutes, type Post } from "@/lib/blog";

export function PostCard({ post, featured = false, headingLevel = "h2" }: { post: Post; featured?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className={`post-card${featured ? " post-card-featured" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="post-card-link">
        <div className="post-card-photo">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={post.cover.width}
            height={post.cover.height}
            sizes={featured ? "(max-width:900px) 92vw, 50vw" : "(max-width:700px) 92vw, (max-width:1100px) 46vw, 30vw"}
            priority={featured}
          />
        </div>
        <div className="post-card-copy">
          <span className="eyebrow">{post.draft && <mark className="draft-flag">Draft</mark>}{post.category}</span>
          <Heading>{post.title}</Heading>
          <p>{post.excerpt}</p>
          <span className="post-card-meta">
            <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time> · {readingMinutes(post)} min read
          </span>
        </div>
      </Link>
    </article>
  );
}
