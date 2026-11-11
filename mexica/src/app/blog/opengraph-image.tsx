import { brandCard, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/lib/seo";
export const alt = `${site.blogName}: Mexican food guides from Locust Grove, Virginia`;
export const size = ogSize;
export const contentType = ogContentType;
export default function Image() {
  return brandCard({ eyebrow: site.blogName, title: "Stories from our kitchen.", plate: "enchiladas" });
}
