import { HomePage } from "@/components/home-page";
import { JsonLd, restaurantSchema, websiteSchema } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={[restaurantSchema(), websiteSchema()]} />
      <HomePage />
    </>
  );
}
