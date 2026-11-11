import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusPage } from "@/ordering/status-page";
import { OrderHeader } from "@/ordering/site-header";
import "@/ordering/ordering.css";
import "@/ordering/theme.css";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

export default function OrderStatus() {
  return (
    <>
      <OrderHeader />
      <Suspense>
        <StatusPage />
      </Suspense>
    </>
  );
}
