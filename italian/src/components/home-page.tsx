import Link from "next/link";
import Image from "next/image";
import {
  Story,
  MenuSection,
  Experience,
  CateringSection,
  GallerySection,
  VisitSection,
} from "@/components/sections";
import { OrderLink } from "@/components/site-shell";
import { HeroStamp } from "@/components/hero-stamp";
import { GoogleRating } from "@/components/google-rating";

/** The two running words. The front copy shows only CUCINA, so the fork sits between BELLA and CUCINA. */
function HeroType({ front = false }: { front?: boolean }) {
  return (
    <div className={`hero-type ${front ? "hero-type-front" : "hero-type-back"}`} aria-hidden="true">
      {["BELLA", "CUCINA"].map((word, row) => (
        <div className="hero-line" data-direction={row ? "left" : "right"} key={word}>
          {Array.from({ length: 4 }, (_, group) => (
            <div className="hero-repeat" key={group}>
              {Array.from({ length: 4 }, (_, index) => (
                <span className={(index + row) % 2 ? "hero-outline" : undefined} key={index}>
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
export function HomePage() {
  return (
    <main id="main">
      <section data-hero="pizza" className="hero bella-hero hero-variant">
        <h1 className="sr-only">
          Bella Cucina of the Lake — Italian restaurant in Locust Grove,
          Virginia
        </h1>
        <HeroType />
        <Image
          src="/images/hero-pizza-fork.png"
          alt="A slice of pepperoni pizza on a silver fork with melting cheese and fresh basil"
          width={768}
          height={1206}
          sizes="(max-width:700px) 90vw, 50vw"
          className="hero-food"
          priority
          quality={95}
        />
        <HeroType front />
        <HeroStamp />
        <div className="hero-actions">
          <Link href="#our-menu" className="sticker sticker-yellow">
            Explore our menu ↗
          </Link>
          <OrderLink className="sticker sticker-outline" />
        </div>
        <div className="hero-bottom">
          <Link href="#visit">
            Locust Grove, Virginia · Open daily from 8 am
          </Link>
          <a href="#our-menu" aria-label="Scroll to explore the menu">
            A little taste of Italy ↓
          </a>
        </div>
      </section>
      <div className="welcome-ribbon" aria-hidden="true">
        PASTA. PIZZA. GOOD COMPANY. <span>✳</span> THAT’S AMORE. <span>✳</span>{" "}
        BELLA CUCINA.
      </div>
      <GoogleRating />
      <div className="page-panels">
        <Story />
        <MenuSection />
        <Experience />
        <CateringSection />
        <GallerySection />
        <VisitSection />
      </div>
    </main>
  );
}
