"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { restaurant as r } from "@/lib/restaurant";

const links = [
  ["The menu", "/#menu"],
  ["Our story", "/#story"],
  ["Catering", "/catering"],
  ["Blog", "/blog"],
  ["Visit us", "/#visit"],
] as const;

/** The site's dark pill navigation for inner pages (ordering, catering, blog), with the same mobile menu as home. */
export function OrderHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="nav-shell order-nav">
      <div className="nav-bar">
        <nav className="desktop-nav" aria-label="Main">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="brand" aria-label="Bella Cucina Mexican home">
          <span className="wordmark">
            <b>Bella Cucina</b>
            <small>MEXICAN KITCHEN</small>
          </span>
        </Link>
        <div className="nav-actions">
          <a href={r.phoneHref} className="nav-visit order-nav-phone">
            {r.phone} <Phone size={15} aria-hidden="true" />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight />
            </Link>
          ))}
          <a href={r.phoneHref} onClick={() => setOpen(false)}>
            Call {r.phone}
            <Phone />
          </a>
        </nav>
      )}
    </header>
  );
}

export { OrderHeader as SiteHeader };
