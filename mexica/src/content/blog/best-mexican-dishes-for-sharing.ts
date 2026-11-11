import type { Post } from "@/lib/blog";

const post: Post = {
  slug: "best-mexican-dishes-for-sharing",
  title: "Made to Share: The Best Mexican Food for a Group Dinner",
  seoTitle: "Mexican Food for a Group Dinner in Locust Grove, VA",
  description:
    "Planning Mexican food for a group dinner? What to share, from loaded nachos to Steak Mexicano, and how to order it at Bella Cucina Mexican in Locust Grove, VA.",
  excerpt:
    "Nachos in the middle, tacos to pass, a big plate from the grill and a personal plate for anyone who doesn’t share. Here’s how we’d order for a table of four to eight.",
  category: "Menu guides",
  tags: ["group dinner", "sharing", "nachos", "menu"],
  keywords: [
    "Mexican food for a group dinner",
    "best Mexican dishes to share",
    "group dinner Locust Grove VA",
    "Mexican restaurant for groups near Lake of the Woods",
  ],
  datePublished: "2026-11-11",
  draft: true,
  author: { name: "Bella Cucina Mexican Kitchen", role: "The team at Bella Cucina Mexican" },
  // DRAFT COVER (temporary real photo). Before publishing, generate:
  //   public/images/blog/best-mexican-dishes-for-sharing.webp · 1600x900 WebP ≤250 KB
  //   Prompt: A group of six friends at a wooden booth passing loaded nachos, tacos and steak with peppers, the real yellow-and-blue dining room, candid laughter. Photorealistic editorial food photography. No text, no logos, no signage, no watermarks, no menus with writing. Natural hands, believable food texture, no extra fingers.
  //   Then set src to /images/blog/best-mexican-dishes-for-sharing.webp, width 1600, height 900, and rewrite alt to match.
  cover: {
    src: "/images/catering-celebration.webp",
    alt: "Six friends sharing Mexican food for a group dinner, passing a platter of tacos over loaded nachos and a small birthday cake in a dining room with yellow and blue walls and papel picado",
    width: 1254,
    height: 1254,
  },
  ogPlate: "nachos",
  body: [
    {
      type: "p",
      text: "The best Mexican food for a group dinner is food you can pass: a plate of loaded nachos in the middle, tacos that split without a knife, and a big plate from the grill the whole table can pick from. At Bella Cucina Mexican in Locust Grove, we’d start a table of four to eight with nachos, put tacos and Steak Mexicano in the middle, and let anyone who’d rather not share order their own enchiladas or Burrito el Grande. Here’s how we’d build that order, dish by dish.",
    },
    { type: "h2", text: "How to order Mexican food for a group dinner" },
    {
      type: "p",
      text: "Before anyone opens the menu, split the order into two parts: what goes in the middle and what stays in front of each person. Shared plates are the ones that break apart cleanly into bites. Personal plates are the saucy or wrapped dishes that are hard to divide without a mess. Three habits make the rest easy:",
    },
    {
      type: "ul",
      items: [
        "**Start with one shared plate and add as you go.** In the dining room you can always order a second round. It’s much harder to un-order a dish nobody touches.",
        "**Let the sharers share.** Not everyone wants to pass plates. Two people splitting tacos and steak while a third orders a burrito is still a group dinner.",
        "**Mix textures across the table.** Something crunchy, something warm and tender, and something cool and fresh keep the table reaching for more than one plate.",
      ],
    },
    { type: "h2", text: "Loaded nachos: the opening move" },
    {
      type: "p",
      text: "**Loaded nachos** are golden chips, melted cheese and generous toppings, and our menu calls them the dish for the middle of the table. They’re the easiest way to get a group eating while the slow deciders are still reading. Order them the moment everyone sits down, and put the plate where every chair can reach, not at the end nearest the person who ordered it.",
    },
    {
      type: "p",
      text: "If the group is hungry, order mains in the same round. Nachos keep everyone busy while the kitchen works on the rest, and nobody ends up full of chips before the main dishes land.",
    },
    { type: "h2", text: "Tacos and carnitas: build your own at the table" },
    {
      type: "p",
      text: "**Tacos** are made for passing: warm tortillas, fresh cilantro and a squeeze of lime, in a form that splits without any negotiation. For a group, they’re the dish that lets everyone try a bite without committing to a full plate.",
    },
    {
      type: "p",
      text: "**Carnitas** works the same way on a bigger scale. The plate brings golden pork with rice, beans and tortillas, so two or three people can make their own small tacos from it. Set it in the middle with the tortillas on top and let the table build.",
    },
    { type: "h2", text: "From the grill: Steak Mexicano, chicken and shrimp" },
    {
      type: "image",
      src: "/images/plates/steak-mexicano.jpg",
      alt: "Seasoned steak under grilled onions, green peppers and a charred whole pepper, with Mexican rice and refried beans topped with melted cheese on a blue-rimmed plate",
      width: 1400,
      height: 1400,
      caption: "Steak Mexicano: steak with grilled onions, peppers, rice and beans.",
    },
    {
      type: "p",
      text: "**Steak Mexicano** is the plate we’d put in the middle for a hungry group. It’s steak with grilled onions, peppers, rice and beans, and the menu says it’s for the big appetite. Passed around a table, it gives the steak lovers something to share while the rice and beans round out everyone else’s plate.",
    },
    {
      type: "p",
      text: "If part of the table doesn’t eat beef, add **Grilled chicken**, which comes with cilantro, rice and vegetables. For seafood fans, **Shrimp & rice** brings saucy shrimp, rice and fresh accompaniments. Between steak, chicken and shrimp, nearly everyone at a mixed table finds something they want a second bite of.",
    },
    { type: "h2", text: "Dishes better kept to yourself" },
    {
      type: "p",
      text: "Some dishes work better as one person’s dinner. **Enchiladas** are smothered in sauce with lettuce, cheese and rice, and they’re hard to pass without losing half the sauce on the way. **Burrito el Grande** is a generous burrito with rice, beans and pico de gallo, a full meal in one tortilla. Both are good picks for whoever at the table would rather not share. Not sure which? Our [first-visit menu guide](/blog/what-to-order-bella-cucina-mexican-locust-grove) covers both.",
    },
    {
      type: "p",
      text: "For something cool against all the warm dishes, the **Fiesta chicken salad** brings grilled chicken, avocado, tomato and cucumber. On a table that’s heavy on chips and cheese, it gives people a crisp, fresh plate to come back to.",
    },
    { type: "h2", text: "Sample orders for four, six and eight" },
    {
      type: "p",
      text: "These are starting points, not exact amounts. Look at the [menu photos](/#menu) to judge what your group will eat, and add a plate if the first round disappears fast.",
    },
    {
      type: "ul",
      items: [
        "**Four people.** Loaded nachos to start, then tacos and Steak Mexicano in the middle. One personal plate, such as enchiladas, for whoever wants their own.",
        "**Six people.** Loaded nachos, tacos and the Carnitas plate for building small tacos, plus Steak Mexicano. Add Grilled chicken or Shrimp & rice so non-steak eaters have a second option.",
        "**Eight people.** Two rounds of nachos, tacos, Carnitas and Steak Mexicano in the middle, a Fiesta chicken salad for something fresh, and personal plates for anyone who’d rather not share.",
      ],
    },
    {
      type: "tip",
      title: "Order in two rounds",
      text: "Get nachos and one shared plate first, then decide on the second round once you see how hungry the table really is. It’s easier than guessing for eight people at once, and the second round arrives hot.",
    },
    { type: "h2", text: "Hosting the group dinner at home" },
    {
      type: "p",
      text: "If everyone is coming to your house instead, the same middle-plate logic works for pickup. Choose your dishes from our [online pickup menu](/order) for current options, availability and prices, and have one person collect everyone’s picks before placing the order. Set the shared plates down the center of your table and the personal plates at each seat.",
    },
    {
      type: "p",
      text: "Bringing a big group into the dining room, especially later in the evening? Call **(540) 412-5009** first to talk about timing. We’re open from 11 am every day, until 10 pm Monday through Saturday and 9 pm on Sunday. For a party rather than a dinner, see our [catering page](/catering) and the [Mexican catering guide](/blog/mexican-catering-taco-party-guide-locust-grove), which covers guest counts and pickup timing.",
    },
    {
      type: "cta",
      title: "Gathering the group?",
      text: "Pick your shared plates from the current pickup menu at Bella Cucina Mexican, or call (540) 412-5009 to plan a bigger spread.",
      href: "/order",
      label: "Order for pickup",
    },
  ],
  faqs: [
    {
      q: "What Mexican food is good for a group?",
      a: "Dishes you can pass work best: loaded nachos, tacos and a big grill plate like Steak Mexicano. Saucy or wrapped dishes such as enchiladas and burritos are better as personal plates.",
    },
    {
      q: "What is the best Mexican dish to share?",
      a: "Loaded nachos are the classic shared plate because everyone can reach in from their seat. Tacos are a close second because they split easily.",
    },
    {
      q: "How much Mexican food should I order for a group of 6?",
      a: "Start with nachos and two or three shared plates, plus a personal plate for anyone who doesn’t want to share. Order a second round if the first disappears fast.",
    },
    {
      q: "Can I order Mexican food for a group for pickup in Locust Grove?",
      a: "Yes. Use Bella Cucina Mexican’s online ordering page for pickup at 4444 Germanna Highway. For a party, call (540) 412-5009 about catering.",
    },
  ],
  related: ["what-to-order-bella-cucina-mexican-locust-grove", "mexican-restaurant-near-lake-of-the-woods"],
};

export default post;
