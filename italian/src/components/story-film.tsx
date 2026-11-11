"use client";
import { useRef, useState, type ReactNode } from "react";
import { Play } from "lucide-react";

/** The storefront film over its photo: hover plays it, and a tap or the keyboard toggles it. Nothing downloads until then. */
export function StoryFilm({ children }: { children: ReactNode }) {
  const clip = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const start = () => {
    const video = clip.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };
  const stop = () => clip.current?.pause();
  return (
    <div
      className={`story-film ${playing ? "is-playing" : ""}`}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") start(); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") stop(); }}
    >
      {children}
      <video
        ref={clip}
        src="/films/lake-entry.mp4"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        aria-label="Play the Bella Cucina of the Lake film"
        aria-pressed={playing}
        onClick={() => (clip.current?.paused ? start() : stop())}
      >
        <Play aria-hidden="true" />
      </button>
    </div>
  );
}
