"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem, LottiePlayer } from "lottie-web";
import animationData from "./kitchen-loading.json";

/**
 * Pot-on-the-stove Lottie shown while the menu loads. The light SVG player is loaded on the
 * client only, after paint, so it never delays the page. Reduced-motion users get a still frame.
 */
export function KitchenLoader({ size = 190 }: { size?: number }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: AnimationItem | undefined;
    let cancelled = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("lottie-web/build/player/lottie_light").then((mod) => {
      if (cancelled || !box.current) return;
      const lottie = (mod.default ?? mod) as LottiePlayer;
      anim = lottie.loadAnimation({ container: box.current, renderer: "svg", loop: !still, autoplay: !still, animationData });
      if (still) anim.goToAndStop(20, true);    });
    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, []);

  return <div ref={box} className="ord-loader" style={{ width: size, height: size * 0.85 }} aria-hidden="true" />;
}
