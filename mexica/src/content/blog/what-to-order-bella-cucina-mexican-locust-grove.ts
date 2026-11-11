import type { Post } from "@/lib/blog";

const post: Post = {
  slug: "what-to-order-bella-cucina-mexican-locust-grove",
  title: "First Time at Bella Cucina Mexican? Here’s What to Order",
  seoTitle: "What to Order at Bella Cucina Mexican in Locust Grove, VA",
  description:
    "Tacos, loaded nachos, Burrito el Grande, enchiladas and Steak Mexicano: a first-timer's guide to the Mexican food at Bella Cucina Mexican in Locust Grove, VA.",
  excerpt:
    "From warm tortillas to sizzling plates from the grill, here is where to start on your first visit, and what to order when you want to share.",
  category: "Menu guides",
  tags: ["menu", "tacos", "nachos", "burritos"],
  keywords: [
    "Mexican restaurant Locust Grove VA",
    "best tacos near Lake of the Woods",
    "Mexican food Orange County VA",
    "burrito Locust Grove",
    "nachos near me Locust Grove",
  ],
  datePublished: "2026-11-10",
  author: { name: "Bella Cucina Mexican Kitchen", role: "The team at Bella Cucina Mexican" },
  cover: {
    src: "/images/plates/tacos.jpg",
    alt: "Tacos on warm tortillas with fresh cilantro and lime",
    width: 1400,
    height: 1400,
  },
  ogPlate: "tacos",
  body: [
    {
      type: "p",
      text: "Coming in from Lake of the Woods, heading home along Route 3, or finally trying the colorful place on Germanna Highway? Here is where we would start. For current prices and availability, check [online ordering](/order).",
    },
    { type: "h2", text: "Start with tacos" },
    {
      type: "p",
      text: "**Tacos** are the first delicious decision: warm tortillas, fresh cilantro and a squeeze of lime. If you only order one thing on your first visit, make it this.",
    },
    { type: "h2", text: "Share the loaded nachos" },
    {
      type: "image",
      src: "/images/plates/nachos.jpg",
      alt: "A plate of loaded nachos with melted cheese",
      width: 1400,
      height: 1400,
      caption: "Loaded nachos, made for the middle of the table.",
    },
    {
      type: "p",
      text: "**Loaded nachos** are golden chips, melted cheese and generous toppings, built for the middle of the table. Order them first and let everyone dig in while you decide on mains.",
    },
    { type: "h2", text: "Bring an appetite for Burrito el Grande" },
    {
      type: "p",
      text: "**Burrito el Grande** lives up to the name: a generous burrito with rice, beans and pico de gallo. Ideal when you want one big satisfying plate.",
    },
    { type: "h2", text: "Saucy, cheesy enchiladas" },
    {
      type: "p",
      text: "**Enchiladas** come smothered in sauce and piled high with lettuce, cheese and rice. Comfort food, Mexican style.",
    },
    { type: "h2", text: "From the grill" },
    {
      type: "ul",
      items: [
        "**Steak Mexicano.** Steak with grilled onions, peppers, rice and beans, for the big appetite.",
        "**Grilled chicken.** Golden and saucy, with cilantro, rice and vegetables.",
        "**Carnitas.** Golden, tender pork with rice, beans and tortillas.",
        "**Shrimp and rice.** Saucy shrimp with rice and fresh accompaniments, when you want a little heat.",
      ],
    },
    { type: "h2", text: "Something fresh" },
    {
      type: "p",
      text: "The **Fiesta chicken salad** brings grilled chicken, avocado, tomato and cucumber together. Crisp, cool and still plenty filling.",
    },
    { type: "h2", text: "Dine in or take it home" },
    {
      type: "p",
      text: "We are open 11 am to 10 pm Monday through Saturday and 11 am to 9 pm on Sunday at **4444 Germanna Highway** in Locust Grove. Pull up a chair, or [order online for pickup](/order).",
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
      q: "What are Bella Cucina Mexican's hours?",
      a: "Monday through Saturday, 11:00 am to 10:00 pm. Sunday, 11:00 am to 9:00 pm.",
    },
    {
      q: "Can I order Bella Cucina Mexican online?",
      a: "Yes. Choose your favorites on our Order online page and pick them up at 4444 Germanna Highway in Locust Grove.",
    },
    {
      q: "What should I order on my first visit?",
      a: "Start with tacos and a plate of loaded nachos to share. If you are hungry, add Burrito el Grande or Steak Mexicano.",
    },
  ],
  related: ["mexican-catering-taco-party-guide-locust-grove"],
};

export default post;
