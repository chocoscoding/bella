import { brandCard, ogContentType, ogSize } from "@/lib/og";
import { getAllPosts, getPost } from "@/lib/blog";
export const alt = "The Bella Mexican Blog: Mexican food guides from Locust Grove, Virginia";
export const size = ogSize;
export const contentType = ogContentType;
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return brandCard({ eyebrow: post ? `Blog · ${post.category}` : "The Bella Mexican Blog", title: post?.title ?? "Stories from our kitchen.", plate: post?.ogPlate ?? "tacos" });
}
