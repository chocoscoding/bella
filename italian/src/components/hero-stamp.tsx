"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
export function HeroStamp() {
  const coin = useRef<HTMLSpanElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const [back, setBack] = useState(false);
  const currentFace = useRef(false);
  useEffect(() => () => { animation.current?.kill(); }, []);
  const flip = (next: boolean) => {
    const node = coin.current;
    if (!node) return;
    animation.current?.kill();
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) { currentFace.current = next; setBack(next); gsap.set(node, { rotationY: 0, y: 0 }); return; }
    if (currentFace.current === next) {
      animation.current = gsap.timeline().to(node, { rotationY: 0, y: next ? -5 : 0, duration: 0.35, ease: "power2.out" });
      return;
    }
    animation.current = gsap.timeline()
      .to(node, { rotationY: next ? 90 : -90, y: -5, duration: 0.28, ease: "power2.in" })
      .call(() => { currentFace.current = next; setBack(next); })
      .set(node, { rotationY: next ? -90 : 90 })
      .to(node, { rotationY: 0, y: next ? -5 : 0, duration: 0.42, ease: "power2.out" });
  };
  return <Link href="#our-story" className="hero-stamp" aria-label="Italian soul, Virginia heart — get to know Bella Cucina" onMouseEnter={() => flip(true)} onMouseLeave={() => flip(false)} onFocus={() => flip(true)} onBlur={() => flip(false)}>
    <span className={`stamp-coin ${back ? "is-back" : ""}`} ref={coin} aria-hidden="true">
      <span className="stamp-caption">{back ? "A LITTLE ITALY" : "ITALIAN SOUL"}</span>
      {back ? <span className="stamp-greeting">CIAO!</span> : <svg className="stamp-symbol" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5"><path d="M50 5V95M5 50H95M18 18L82 82M18 82L82 18" /></svg>}
      <span className="stamp-caption">{back ? "RIGHT HERE" : "VIRGINIA HEART"}</span>
    </span>
  </Link>;
}
