import Link from "next/link";
import Image from "next/image";
import { formatDate, type PostSummary } from "@/lib/blog";

export function PostCard({ post, featured = false, headingLevel = "h2", priority = featured }: { post: PostSummary; featured?: boolean; headingLevel?: "h2" | "h3"; priority?: boolean }) {
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
            priority={priority}
          />
        </div>
        <div className="post-card-copy">
          <span className="eyebrow">{post.draft && <mark className="draft-flag">Draft</mark>}{post.category}</span>
          <Heading>{post.title}</Heading>
          <p>{post.excerpt}</p>
          <span className="post-card-meta">
            <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time> · {post.minutes} min read
          </span>
        </div>
      </Link>
    </article>
  );
}
