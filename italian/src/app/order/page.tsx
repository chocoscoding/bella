import type { Metadata } from "next";
import { OrderPage } from "@/ordering/order-page";
import "@/ordering/ordering.css";
import "@/ordering/theme.css";

export const metadata: Metadata = {
  title: "Order Italian Food Online for Pickup",
  description: "Order Bella Cucina’s pasta, pizza and Italian favorites online for pickup at 4444 Germanna Highway in Locust Grove, Virginia.",
  alternates: { canonical: "/order" },
};

export default async function Order({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const { cancelled } = await searchParams;
  return <OrderPage cancelledRef={cancelled} />;
}
