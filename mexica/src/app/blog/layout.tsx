import { OrderHeader } from "@/ordering/site-header";
import { SiteFooter } from "@/components/site-footer";
import "@/ordering/theme.css";
import "./blog.css";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-inner">
      <a className="skip" href="#main">Skip to content</a>
      <OrderHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
