import { brandCard, ogContentType, ogSize } from "@/lib/og";
export const alt = "Italian catering from Bella Cucina of the Lake in Locust Grove, Virginia";
export const size = ogSize;
export const contentType = ogContentType;
export default function Image() {
  return brandCard({ eyebrow: "Catering · Locust Grove, VA", title: "You bring the people. We bring Italy." });
}
