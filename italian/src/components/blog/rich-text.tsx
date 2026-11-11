import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { slugify, type Block } from "@/lib/blog";

/** Renders [text](href) and **bold** inside a text field. */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const href = m[2] ?? "";
    if (m[3]) out.push(<strong key={m.index}>{m[3]}</strong>);
    else if (href.startsWith("/") || href.startsWith("#")) out.push(<Link key={m.index} href={href}>{m[1]}</Link>);
    else if (href.startsWith("tel:") || href.startsWith("mailto:")) out.push(<a key={m.index} href={href}>{m[1]}</a>);
    else out.push(<a key={m.index} href={href} target="_blank" rel="noopener noreferrer">{m[1]}</a>);
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case "p":
        return <p key={i}><Inline text={b.text} /></p>;
      case "h2":
        return <h2 key={i} id={slugify(b.text)}><Inline text={b.text} /></h2>;
      case "h3":
        return <h3 key={i}><Inline text={b.text} /></h3>;
      case "ul":
        return <ul key={i}>{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ul>;
      case "ol":
        return <ol key={i}>{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ol>;
      case "quote":
        return (
          <blockquote key={i}>
            <p><Inline text={b.text} /></p>
            {b.cite && <cite>{b.cite}</cite>}
          </blockquote>
        );
      case "tip":
        return (
          <aside key={i} className="article-tip">
            <strong>{b.title}</strong>
            <p><Inline text={b.text} /></p>
          </aside>
        );
      case "image":
        return (
          <figure key={i}>
            <Image src={b.src} alt={b.alt} width={b.width} height={b.height} sizes="(max-width:800px) 92vw, 720px" />
            {b.caption && <figcaption>{b.caption}</figcaption>}
          </figure>
        );
      case "cta":
        return (
          <aside key={i} className="article-cta">
            <strong>{b.title}</strong>
            <p><Inline text={b.text} /></p>
            {b.href.startsWith("/") ? (
              <Link href={b.href} className="sticker sticker-yellow">{b.label} ↗</Link>
            ) : (
              <a href={b.href} className="sticker sticker-yellow">{b.label} ↗</a>
            )}
          </aside>
        );
    }
  });
}
