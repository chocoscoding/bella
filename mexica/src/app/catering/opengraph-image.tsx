import { brandCard, ogContentType, ogSize } from "@/lib/og";
export const alt = "Mexican catering from Bella Cucina Mexican in Locust Grove, Virginia";
export const size = ogSize;
export const contentType = ogContentType;
export default function Image() {
  return brandCard({ eyebrow: "Catering · Locust Grove, VA", title: "You bring the occasion. We bring the flavor.", plate: "tacos" });
}
