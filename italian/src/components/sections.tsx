import Image from "next/image";
import Link from "next/link";
import { OrderLink } from "./site-shell";
import { StoryFilm } from "./story-film";
import { featured, gallery, restaurant as r } from "@/lib/restaurant";
export function FoodImage({
  name,
  alt,
  className = "",
  priority = false,
}: {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/images/${name}.webp`}
      alt={alt}
      width={1000}
      height={1000}
      quality={75}
      className={className}
      priority={priority}
      sizes="(max-width:700px) 92vw, 60vw"
    />
  );
}
export function Story() {
  return (
    <section className="panel bella-story" id="our-story">
      <div className="story-heading" data-reveal>
        <span className="eyebrow">Welcome to Bella Cucina</span>
        <h2>
          Italian soul.
          <br />
          Virginia heart.
        </h2>
      </div>
      <div className="bella-story-grid">
        <div className="story-photo">
          <StoryFilm>
            <FoodImage
              name="exterior"
              alt="The entrance to Bella Cucina of the Lake in Locust Grove"
            />
          </StoryFilm>
          <span className="photo-note">Your little corner of Italy.</span>
        </div>
        <div className="bella-story-copy" data-reveal>
          <span className="small-star" aria-hidden="true">
            ✳
          </span>
          <p>
            Pull up a chair in Locust Grove. We bring the flavors of Italy to
            the table with comforting classics and a warm welcome.
          </p>
          <p>
            Whether it’s a favorite pasta, a pizza to share, or a meal with the
            whole family, there’s a place for you at Bella Cucina.
          </p>
        </div>
      </div>
    </section>
  );
}
export function MenuSection() {
  return (
    <section className="panel bella-menu" id="our-menu">
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">A taste of the good life</span>
          <h2>
            Your next
            <br />
            favorite bite.
          </h2>
        </div>
        <p>
          From bubbling baked pasta to seafood linguini.
          <br />
          Find your favorite, or try a little something new.
        </p>
      </div>
      <div className="bella-dishes">
        {featured.map((d) => (
          <a href={r.officialMenuUrl} key={d.name} className="bella-dish" data-reveal>
            <div className="dish-photo">
              <FoodImage name={d.image} alt={d.name} />
            </div>
            <div className="bella-dish-info">
              <span className="eyebrow">{d.category}</span>
              <h3>{d.name}</h3>
              <div className="dish-price-line">
                <span>${d.price.toFixed(2)}</span>
                <span>Made for a good appetite.</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="menu-cta">
        <a className="sticker sticker-yellow" href={r.officialMenuUrl}>
          Explore the menu ↗
        </a>
        <OrderLink className="sticker sticker-outline" />
      </div>
      <p className="price-note">
        Prices shown from our published menu. Check online ordering for current
        pricing and availability.
      </p>
    </section>
  );
}
export function Experience() {
  return (
    <section className="panel experience-panel bella-experience">
      <Image
        src="/images/pizza-slice-spatula.png"
        width={1129}
        height={2000}
        alt="A slice of pepperoni pizza lifted on a spatula, with melted cheese stretching down from it"
        className="experience-food"
        sizes="(max-width:700px) 100vw, 45vw"
        quality={90}
      />
      <div className="experience-content">
        <span className="eyebrow">There’s always a reason</span>
        <h2 className="experience-heading">
          <span className="experience-recede">
            Good food.
            <span className="experience-liquid" aria-hidden="true">Good food.</span>
          </span>
          <span className="experience-recede">
            Italian experience.
            <span className="experience-liquid" aria-hidden="true">Italian experience.</span>
          </span>
          <span className="experience-finale">
            Bella Cucina.
            <span className="experience-liquid" aria-hidden="true">Bella Cucina.</span>
          </span>
        </h2>
        <div className="values-grid" data-reveal>
          {[
            ["01", "Start your day", "Doors open at 8 am, seven days a week."],
            [
              "02",
              "Italian favorites",
              "Pasta, pizza, and the classics you come back for.",
            ],
            [
              "03",
              "Something for everyone",
              "Subs, salads, and a menu for the little ones.",
            ],
            [
              "04",
              "Take us home",
              "Order online and make tonight an Italian night.",
            ],
          ].map(([n, title, copy]) => (
            <div key={n}>
              <span className="value-number">{n} /</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
        <OrderLink className="sticker sticker-cream" />
      </div>
    </section>
  );
}
export function CateringSection() {
  return (
    <section className="panel bella-catering" id="catering">
      <div data-reveal>
        <span className="eyebrow">A little more to celebrate</span>
        <h2>
          You bring
          <br />
          the people.
          <br />
          We bring Italy.
        </h2>
        <p>
          Make your next gathering a Bella Cucina occasion. Talk to us about
          catering for your party or event.
        </p>
        <Link href={r.cateringUrl} className="sticker sticker-red">
          Let’s plan something ↗
        </Link>
      </div>
      <div className="catering-photo">
        <FoodImage
          name="italian-shared-table"
          alt="Friends sharing Italian pasta, lasagna, focaccia, and antipasti around a table"
        />
        <span className="photo-note">Better when shared.</span>
      </div>
    </section>
  );
}
export function GallerySection() {
  return (
    <section className="panel bella-gallery" id="gallery">
      <div className="section-heading">
        <div data-reveal>
          <span className="eyebrow">Straight from our table</span>
          <h2>
            A feast for
            <br />
            the eyes.
          </h2>
        </div>
      </div>
      <div className="bella-gallery-strip">
        {gallery
          .filter((g) => ["spaghetti", "piccata", "dessert"].includes(g.image))
          .map((g) => (
            <div key={g.image} className="gallery-polaroid">
              <FoodImage name={g.image} alt={g.title} />
              <span>{g.title}</span>
            </div>
          ))}
      </div>
    </section>
  );
}
export function VisitSection() {
  return (
    <section className="panel bella-visit" id="visit">
      <div className="visit-copy" data-reveal>
        <span className="eyebrow">Locust Grove, Virginia</span>
        <h2>
          See you
          <br />
          at Bella.
        </h2>
        <p>
          Find us on Germanna Highway.
          <br />
          Come in for a meal, stay for the company.
        </p>
        <a
          className="sticker sticker-yellow"
          href={r.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions ↗
        </a>
      </div>
      <div className="visit-details">
        <div>
          <span className="eyebrow">Find your way</span>
          <address>
            {r.address}
            <br />
            {r.locality}
          </address>
        </div>
        <div>
          <span className="eyebrow">Our hours</span>
          {r.hours.map(([day, time]) => (
            <div className="hours-row" key={day}>
              <span>{day}</span>
              <strong>{time}</strong>
            </div>
          ))}
        </div>
        <a href={r.phoneHref} className="visit-phone">
          {r.phone} ↗
        </a>
        <p>Questions about your visit or a larger group? Give us a call.</p>
      </div>
    </section>
  );
}
