import { brandCard, ogContentType, ogSize } from "@/lib/og";
export const alt = "Bella Cucina of the Lake, Italian restaurant in Locust Grove, Virginia";
export const size = ogSize;
export const contentType = ogContentType;
export default function Image() {
  return brandCard({ eyebrow: "Pasta · Pizza · Good company", title: "A little Italy. Right here." });
}
