import type { Metadata } from "next";
import { OrderPage } from "@/ordering/order-page";
import { OrderHeader } from "@/ordering/site-header";
import "@/ordering/ordering.css";
import "@/ordering/theme.css";

export const metadata: Metadata = {
  title: "Order Mexican Food Online for Pickup",
  description: "Order tacos, nachos and Mexican favorites from Bella Cucina Mexican online for pickup at 4444 Germanna Highway in Locust Grove, Virginia.",
  alternates: { canonical: "/order" },
};

export default async function Order({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const { cancelled } = await searchParams;
  return (
    <>
      <OrderHeader />
      <OrderPage cancelledRef={cancelled} />
    </>
  );
}
