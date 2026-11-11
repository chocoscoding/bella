"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { restaurant as r } from "@/lib/restaurant";
const links = [
  ["Home", "#main"],
  ["Our menu", "#our-menu"],
  ["Our story", "#our-story"],
  ["Catering", "/catering"],
  ["Gallery", "#gallery"],
  ["Visit us", "#visit"],
  ["Blog", "/blog"],
];
/** Section anchors live on the home page; prefix them when on another route. Page paths pass through. */
function useHomeHref() {
  const path = usePathname();
  const onHome = path === "/";
  return (href: string) => (!href.startsWith("#") || onHome ? href : `/${href}`);
}
export function Brand({ onClick }: { onClick?: () => void }) {
  const home = useHomeHref();
  return (
    <Link
      href={home("#main")}
      className="bella-brand"
      aria-label="Bella Cucina of the Lake home"
      onClick={onClick}
    >
      <Image
        src="/images/logo.webp"
        alt="Bella Cucina of the Lake"
        width={410}
        height={104}
        priority
      />
    </Link>
  );
}
export function OrderLink({
  className = "",
  children = "Order online",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link className={className} href={r.orderUrl}>
      {children}
    </Link>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(),
    root = useRef<HTMLDivElement>(null),
    nav = useRef<HTMLDialogElement>(null);
  const [menu, setMenu] = useState(false);
  const home = useHomeHref();
  useEffect(() => {
    setMenu(false);
    nav.current?.close();
  }, [path]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        if (root.current?.querySelector(".hero-food"))
          gsap.from(".hero-food", {
            opacity: 0,
            duration: 1.25,
            ease: "power3.out",
          });
        gsap.utils.toArray<HTMLElement>(".hero-line").forEach((line) => {
          const right = line.dataset.direction === "right";
          gsap.fromTo(line, { xPercent: right ? -25 : 0 }, {
            xPercent: right ? 0 : -25,
            duration: 40,
            repeat: -1,
            ease: "none",
          });
        });
        gsap.utils.toArray<HTMLElement>(".experience-heading").forEach((heading) => {
          const lines = heading.querySelectorAll(".experience-recede");
          gsap.timeline({
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
              end: "top 20%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
            .to(lines[0], { z: -260, duration: 1, ease: "power2.inOut" })
            .to(lines[0].querySelector(".experience-liquid"), { "--fill": "112%", duration: 1, ease: "none" }, 0)
            .to(lines[1], { z: -260, duration: 1, ease: "power2.inOut" }, 0.7)
            .to(lines[1].querySelector(".experience-liquid"), { "--fill": "112%", duration: 1, ease: "none" }, 0.7)
            .to(heading.querySelector(".experience-finale"), { scale: 1.05, duration: 1.5, ease: "power2.inOut" }, 1.2)
            .to(heading.querySelector(".experience-finale .experience-liquid"), { "--fill": "112%", duration: 1.5, ease: "none" }, 1.2);
        });
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]")
          .forEach((el) =>
            gsap.from(el, {
              y: 35,
              opacity: 0,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            }),
          );
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [path]);
  function toggle() {
    if (menu) {
      nav.current?.close();
      setMenu(false);
    } else {
      nav.current?.showModal();
      setMenu(true);
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.fromTo(
          ".nav-link",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.055, duration: 0.4 },
        );
    }
  }
  return (
    <>
      <div ref={root}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="site-header flex items-center justify-between">
          <Brand />

          <div className="flex items-center gap-2">
            <a href={r.phoneHref} className="header-phone">
              {r.phone}
            </a>
            <OrderLink className="pill pill-yellow header-order" />
            <button
              className="pill pill-outline flex items-center gap-3"
              onClick={toggle}
              aria-expanded={menu}
              aria-haspopup="dialog"
              aria-controls="site-menu"
            >
              Menu{" "}
              <span className="menu-lines" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </header>
        {children}
        <Footer home={home} />
      </div>
      <dialog
        ref={nav}
        id="site-menu"
        aria-label="Website navigation"
        className="nav-dialog"
        onClose={() => setMenu(false)}
        onCancel={() => setMenu(false)}
      >
        <div className="flex items-center justify-between">
          <Brand onClick={toggle} />
          <button autoFocus className="pill pill-outline" onClick={toggle}>
            Close ×
          </button>
        </div>
        <nav className="navigation" aria-label="Main navigation">
          {links.map(([label, href], i) => (
            <Link
              href={home(href)}
              key={href}
              className="nav-link"
              onClick={() => {
                nav.current?.close();
                setMenu(false);
              }}
            >
              <span className="nav-index">{String(i + 1).padStart(2, "0")}</span>
              {label}
              <span className="nav-arrow">↗</span>
            </Link>
          ))}
        </nav>
        <div className="nav-contact">
          <OrderLink className="pill pill-yellow" />
          <a href={r.phoneHref}>{r.phone}</a>
          <p>Locust Grove, Virginia · Italian at heart.</p>
        </div>
      </dialog>
    </>
  );
}
function Footer({ home }: { home: (hash: string) => string }) {
  return (
    <footer className="footer bella-footer">
      <div className="footer-top">
        <div>
          <span className="eyebrow">A little Italy. Right here.</span>
          <Link
            href={home("#main")}
            className="bella-footer-wordmark"
            aria-label="Bella Cucina home"
          >
            BELLA
            <br />
            CUCINA<span>OF THE LAKE</span>
          </Link>
        </div>
        <div>
          <span className="eyebrow">Make yourself at home</span>
          <nav className="footer-links" aria-label="Footer navigation">
            {links.slice(1).map(([label, href]) => (
              <Link key={href} href={home(href)}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-contact">
          <h3>
            Come hungry.
            <br />
            Leave happy.
          </h3>
          <OrderLink className="pill pill-yellow" />
          <a href={r.phoneHref}>{r.phone}</a>
          <a href={r.directionsUrl} target="_blank" rel="noopener noreferrer">
            {r.address}
            <br />
            {r.locality} ↗
          </a>
          <div className="footer-hours">
            {r.hours.map(([day, time]) => (
              <p key={day}>
                {day}
                <br />
                {time}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom flex justify-between gap-4 flex-wrap">
        <p>© {new Date().getFullYear()} Bella Cucina of the Lake.</p>
        <a href={r.facebookUrl} target="_blank" rel="noopener noreferrer">
          Find us on Facebook ↗
        </a>
        <a href="#">Back to top ↑</a>
      </div>
    </footer>
  );
}
