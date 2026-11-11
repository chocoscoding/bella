import Link from "next/link";

export function Breadcrumbs({ items }: { items: [label: string, href?: string][] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map(([label, href], i) => (
          <li key={label}>
            {href && i < items.length - 1 ? <Link href={href}>{label}</Link> : <span aria-current="page">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
