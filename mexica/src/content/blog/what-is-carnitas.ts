import type { Post } from "@/lib/blog";

const post: Post = {
  slug: "what-is-carnitas",
  title: "What Is Carnitas? Golden, Tender Pork, Explained",
  seoTitle: "What Is Carnitas? Mexican Pork, Explained | Bella Cucina",
  description:
    "What is carnitas? Learn where this tender Mexican pork comes from, how it differs from pulled pork, and how to order it at Bella Cucina Mexican in Locust Grove.",
  excerpt:
    "Carnitas is pork cooked low and slow until it pulls apart, then browned until golden. Here’s where it comes from, how it compares with pulled pork, and how to eat it.",
  category: "Menu guides",
  tags: ["carnitas", "pork", "menu"],
  keywords: [
    "what is carnitas",
    "carnitas vs pulled pork",
    "what part of the pig is carnitas",
    "carnitas Locust Grove VA",
  ],
  datePublished: "2026-11-11",
  draft: true,
  author: { name: "Bella Cucina Mexican Kitchen", role: "The team at Bella Cucina Mexican" },
  // DRAFT COVER (temporary real photo). Before publishing, generate:
  //   public/images/blog/what-is-carnitas.webp · 1600x900 WebP ≤250 KB
  //   Prompt: Close-up of golden crispy shredded pork with rice, beans, warm tortillas and lime on a round plate, papel picado softly blurred behind. Photorealistic editorial food photography. No text, no logos, no signage, no watermarks, no menus with writing. Natural hands, believable food texture, no extra fingers.
  //   Then set src to /images/blog/what-is-carnitas.webp, width 1600, height 900, and rewrite alt to match.
  cover: {
    src: "/images/plates/carnitas.jpg",
    alt: "What is carnitas, shown on a plate: browned, tender pieces of pork with whole green jalapeños and a carrot slice, Mexican rice and refried beans with melted cheese on a blue-rimmed plate",
    width: 1400,
    height: 1400,
  },
  ogPlate: "carnitas",
  body: [
    {
      type: "p",
      text: "What is carnitas? Carnitas is Mexican pork, traditionally cut into chunks and cooked slowly in its own fat until it’s tender enough to pull apart, then browned so the edges turn golden and a little crisp. The name means “little meats” in Spanish. The dish comes from the state of Michoacán in west-central Mexico, and it’s usually eaten in warm tortillas. At Bella Cucina Mexican in Locust Grove, our **Carnitas** plate brings golden pork with rice, beans and tortillas, so you can build each bite the way you like it.",
    },
    { type: "h2", text: "What is carnitas, exactly?" },
    {
      type: "p",
      text: "Plenty of cuisines slow-cook pork. What sets carnitas apart is the method. The classic approach is a confit: pieces of pork simmered in lard for hours, often in a wide copper pot called a cazo. Low, steady heat melts the connective tissue so the meat turns soft. Toward the end, the heat goes up and the outside of each piece browns in the same fat.",
    },
    {
      type: "p",
      text: "That gives carnitas two textures in one bite: juicy and shreddable inside, crisp and caramelized at the edges. It’s the reason good carnitas is chopped or pulled into pieces rather than sliced neatly. You want a mix of soft strands and browned corners in every tortilla.",
    },
    {
      type: "p",
      text: "Seasoning is traditionally simple. Salt does most of the work, and cooks add their own touches, such as orange, garlic or bay leaf. Recipes change from family to family and town to town, which is part of the fun of ordering carnitas in different places.",
    },
    {
      type: "p",
      text: "Because the pork is cooked in fat rather than in liquid, carnitas doesn’t come with a sauce of its own. That’s why it’s usually served with tortillas and something bright on the side: the richness of the pork wants a fresh, sharp contrast, whether that’s salsa, onion and cilantro, or a squeeze of lime.",
    },
    { type: "h2", text: "Where carnitas comes from" },
    {
      type: "p",
      text: "Michoacán is the home of carnitas, and the town of Quiroga is especially known for it. There, carnitas is sold by weight at market stalls and shops, chopped to order and piled into tortillas. Many sellers offer a mix of cuts, from lean pieces to richer ones, and regulars ask for the combination they like best.",
    },
    {
      type: "p",
      text: "Outside Mexico, most cooks reach for pork shoulder, sometimes sold as pork butt. Its marbling keeps the meat moist through the long cook and gives the edges plenty to brown. From Michoacán, carnitas spread across Mexico and into the United States, where you’ll now find it in tacos, burritos and on its own as a plate.",
    },
    { type: "h2", text: "Carnitas vs. pulled pork, carne asada and al pastor" },
    {
      type: "p",
      text: "Carnitas often gets compared with other shredded or grilled meats. Here’s how it differs from the three it’s most often confused with.",
    },
    {
      type: "ul",
      items: [
        "**Carnitas vs. pulled pork.** Both are tender pork, usually from the shoulder. American pulled pork is typically smoked or slow-roasted and often served with barbecue sauce. Carnitas is cooked in fat and finished with browned, crisp edges, and it’s eaten with tortillas and salsa rather than a sweet sauce.",
        "**Carnitas vs. carne asada.** Carne asada is beef, grilled quickly over high heat and sliced. Carnitas is pork, cooked low and slow.",
        "**Carnitas vs. al pastor.** Al pastor is also pork, but it’s marinated with dried chiles and spices and traditionally cooked on a vertical spit. Carnitas has a simpler seasoning, so the pork itself is the main flavor.",
      ],
    },
    { type: "h2", text: "Our carnitas plate in Locust Grove" },
    {
      type: "image",
      src: "/images/plates/carnitas.jpg",
      alt: "Browned, tender pieces of pork with whole green jalapeños and a carrot slice, beside Mexican rice and refried beans topped with melted cheese on a blue-rimmed plate",
      width: 1400,
      height: 1400,
      caption: "Carnitas: golden pork, rice, beans and tortillas.",
    },
    {
      type: "p",
      text: "Our **Carnitas** plate is golden pork with rice, beans and tortillas. The menu sums it up in three words, “golden and tender,” and it’s a plate that covers the whole meal: the pork, the rice and beans alongside it, and the tortillas to bring them together.",
    },
    {
      type: "p",
      text: "Because the plate comes with tortillas, you decide how to eat it. Some people make small tacos at the table, one tortilla at a time. Others eat the pork with rice and beans on the fork and save a tortilla for the last bites. Both are right. If you’d rather have beef, **Steak Mexicano** comes with grilled onions, peppers, rice and beans. For a look at the rest of the menu, see our [first-visit guide to what to order](/blog/what-to-order-bella-cucina-mexican-locust-grove), or [browse the menu photos](/#menu).",
    },
    { type: "h2", text: "How to eat carnitas" },
    {
      type: "p",
      text: "There’s no wrong way, but this is how we’d approach a plate of carnitas with tortillas:",
    },
    {
      type: "ol",
      items: [
        "**Start with a warm tortilla.** Lay it flat on the plate or in your hand.",
        "**Add a little pork.** A modest amount lets the tortilla fold closed without tearing.",
        "**Add rice or beans if you like.** A spoonful of either turns a small taco into a fuller bite.",
        "**Finish it your way.** In Michoacán, carnitas tacos are usually topped with chopped onion, cilantro, salsa and a squeeze of lime.",
      ],
    },
    {
      type: "tip",
      title: "Mix the textures",
      text: "Carnitas is best when each bite has both soft and crisp pieces. Pull a browned edge and a tender piece into the same tortilla instead of eating all the crisp bits first.",
    },
    { type: "h2", text: "Carnitas for pickup or a crowd" },
    {
      type: "p",
      text: "Carnitas makes a good pickup dinner because you assemble it yourself at the table. If the tortillas have cooled on the drive home, warm each one for a few seconds in a dry skillet and they’ll fold again easily. Check current dishes, availability and prices on our [online pickup menu](/order), then pick up at **4444 Germanna Highway**. We’re open from 11 am every day, until 10 pm Monday through Saturday and 9 pm on Sunday.",
    },
    {
      type: "p",
      text: "Feeding more people? Carnitas with rice and beans is a hearty option for a party alongside tacos and loaded nachos. Our [Mexican catering guide](/blog/mexican-catering-taco-party-guide-locust-grove) covers guest counts and timing, and you can call **(540) 412-5009** or visit the [catering page](/catering) to plan it with the kitchen.",
    },
    {
      type: "cta",
      title: "Ready to try carnitas?",
      text: "Golden pork, rice, beans and tortillas, ready for pickup on Germanna Highway in Locust Grove.",
      href: "/order",
      label: "Order for pickup",
    },
  ],
  faqs: [
    {
      q: "What is carnitas made of?",
      a: "Carnitas is pork, traditionally cut into chunks, cooked slowly in fat until tender and then browned. The name means “little meats” in Spanish.",
    },
    {
      q: "What part of the pig is carnitas?",
      a: "Most cooks use pork shoulder, also sold as pork butt, because its marbling keeps the meat moist. In Michoacán, carnitas shops often sell a mix of cuts.",
    },
    {
      q: "What is the difference between carnitas and pulled pork?",
      a: "Pulled pork is usually smoked or slow-roasted and served with barbecue sauce. Carnitas is cooked in fat until tender, browned until the edges crisp, and eaten with tortillas and salsa.",
    },
    {
      q: "How do you eat carnitas?",
      a: "Most often in warm tortillas as tacos. At Bella Cucina Mexican, the Carnitas plate comes with rice, beans and tortillas, so you can build small tacos or eat it with a fork.",
    },
    {
      q: "Where can I get carnitas in Locust Grove, VA?",
      a: "Bella Cucina Mexican at 4444 Germanna Highway serves Carnitas with golden pork, rice, beans and tortillas. Eat in the dining room or order online for pickup.",
    },
  ],
  related: ["what-to-order-bella-cucina-mexican-locust-grove", "mexican-catering-taco-party-guide-locust-grove"],
};

export default post;
