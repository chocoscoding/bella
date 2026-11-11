import type { Post } from "@/lib/blog";

const post: Post = {
  slug: "what-to-order-bella-cucina-locust-grove",
  title: "What to Order at Bella Cucina: Italian Classics in Locust Grove",
  seoTitle: "What to Order at Bella Cucina | Italian Food in Locust Grove",
  description:
    "First visit to Bella Cucina of the Lake? The pasta, seafood and pizza we'd point you to first in Locust Grove, VA, with prices from our published menu.",
  excerpt:
    "Baked ziti, seafood linguini, shrimp scampi and a slice of pepperoni: a first-timer's guide to the Italian dishes worth the drive down Germanna Highway.",
  category: "Menu guides",
  tags: ["menu", "pasta", "seafood", "pizza"],
  keywords: [
    "Italian restaurant Locust Grove VA",
    "best pasta near Lake of the Woods",
    "Italian food Orange County VA",
    "shrimp scampi Locust Grove",
    "pizza Locust Grove VA",
  ],
  datePublished: "2026-11-10",
  author: { name: "Bella Cucina Kitchen", role: "The team at Bella Cucina of the Lake" },
  cover: {
    src: "/images/ziti.webp",
    alt: "Baked ziti with bubbling mozzarella and tomato sauce",
    width: 1000,
    height: 1500,
  },
  body: [
    {
      type: "p",
      text: "Whether you are coming in from Lake of the Woods, stopping on the way back from Fredericksburg or picking up dinner on Route 3, here are the Italian dishes we would put in front of a first-timer. Prices are from our published menu; [online ordering](/order) always has the current price and availability.",
    },
    { type: "h2", text: "Spaghetti, the way you remember it" },
    {
      type: "p",
      text: "**Spaghetti ($14.75)** comes with your choice of meatballs, sausage or mushrooms. It is the dish most tables order at least once, and the one kids and grandparents agree on.",
    },
    { type: "h2", text: "Baked ziti, straight from the oven" },
    {
      type: "p",
      text: "**Baked Ziti ($14.75)** is penne, ricotta and mozzarella baked in tomato sauce until the top turns golden. Comfort food that also happens to travel well, which is why it is our go-to suggestion for [catering](/catering).",
    },
    { type: "h2", text: "Seafood linguini for the table that wants more" },
    {
      type: "image",
      src: "/images/seafood.webp",
      alt: "Linguini with shrimp, calamari, mussels and clams in marinara",
      width: 448,
      height: 500,
      caption: "Linguini with shrimp, calamari, mussels and clams.",
    },
    {
      type: "p",
      text: "**Linguini alla Pescatore ($21.75)** brings shrimp, calamari, mussels and clams together in marinara. It is the most generous plate on this list and a good one to share.",
    },
    { type: "h2", text: "Shrimp scampi, light and garlicky" },
    {
      type: "p",
      text: "**Shrimp Scampi ($18.25)** is angel hair with shrimp, garlic, olive oil and white wine. If you want seafood without a red sauce, start here.",
    },
    { type: "h2", text: "Pizza, subs and something for the kids" },
    {
      type: "p",
      text: "Not everyone wants pasta. There is pepperoni pizza to share, subs and salads, and a menu for the little ones, so the whole family can find something.",
    },
    {
      type: "tip",
      title: "Save room",
      text: "Dessert is the easiest way to turn a quick dinner into a small celebration.",
    },
    { type: "h2", text: "Dine in or take it home" },
    {
      type: "p",
      text: "We open at 8 am every day and stay open until 10 pm Monday through Saturday and 9 pm on Sunday. Come in at **4444 Germanna Highway**, or [order online for pickup](/order) and make it an Italian night at home.",
    },
    {
      type: "cta",
      title: "Hungry yet?",
      text: "Order your favorites for pickup in Locust Grove.",
      href: "/order",
      label: "Order online",
    },
  ],
  faqs: [
    {
      q: "What are Bella Cucina of the Lake's hours?",
      a: "Monday through Saturday, 8:00 am to 10:00 pm. Sunday, 8:00 am to 9:00 pm.",
    },
    {
      q: "Can I order Bella Cucina online for pickup?",
      a: "Yes. Use the Order online page to choose your dishes and pick them up at 4444 Germanna Highway in Locust Grove.",
    },
    {
      q: "Is there a kids menu?",
      a: "Yes. Along with pasta and pizza, we have subs, salads and a menu for the little ones.",
    },
  ],
  related: ["italian-catering-party-guide-locust-grove"],
};

export default post;
