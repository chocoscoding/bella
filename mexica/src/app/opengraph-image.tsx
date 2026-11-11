import { brandCard, ogContentType, ogSize } from "@/lib/og";
export const alt = "Bella Cucina Mexican, Mexican restaurant in Locust Grove, Virginia";
export const size = ogSize;
export const contentType = ogContentType;
export default function Image() {
  return brandCard({ eyebrow: "Tacos · Nachos · Good company", title: "A fresh taste of Mexico.", plate: "nachos" });
}
