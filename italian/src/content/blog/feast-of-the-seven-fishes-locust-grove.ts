import type { Post } from "@/lib/blog";

const post: Post = {
  slug: "feast-of-the-seven-fishes-locust-grove",
  title: "Feast of the Seven Fishes in Locust Grove, Virginia: A Christmas Eve Guide",
  seoTitle: "Feast of the Seven Fishes in Virginia | Bella Cucina",
  description:
    "Planning a Feast of the Seven Fishes in Virginia? Build your Christmas Eve table around our seafood pastas from Locust Grove, plus a few dishes made at home.",
  excerpt:
    "The Italian-American Christmas Eve seafood dinner, explained, plus an honest plan for a seven-fish table: our two seafood pastas cover four, your kitchen covers the rest.",
  category: "Seasonal",
  tags: ["Christmas Eve", "Feast of the Seven Fishes", "seafood", "holidays"],
  keywords: [
    "Feast of the Seven Fishes Virginia",
    "Feast of the Seven Fishes Locust Grove",
    "Christmas Eve seafood dinner",
    "Italian Christmas Eve dinner Virginia",
    "seafood pasta near Lake of the Woods",
  ],
  draft: true,
  datePublished: "2026-11-11",
  author: { name: "Bella Cucina Kitchen", role: "The team at Bella Cucina of the Lake" },
  // DRAFT COVER (temporary real photo). Before publishing, generate:
  //   public/images/blog/feast-of-the-seven-fishes-locust-grove.webp · 1600x900 WebP ≤250 KB
  //   Prompt: A festive Christmas Eve Italian table with several seafood dishes: shrimp pasta, mussels, calamari, clams, candles, red napkins, pine sprigs, warm low light. Photorealistic editorial food photography. No text, no logos, no signage, no watermarks, no menus with writing. Natural hands, believable food texture, no extra fingers.
  //   Then set src to /images/blog/feast-of-the-seven-fishes-locust-grove.webp, width 1600, height 900, and rewrite alt to match.
  cover: {
    src: "/images/seafood.webp",
    alt: "Seafood pasta for a Feast of the Seven Fishes in Virginia: linguini with mussels, clams, shrimp and calamari in red marinara on a white plate",
    width: 448,
    height: 500,
  },
  body: [
    {
      type: "p",
      text: "If you are planning a Feast of the Seven Fishes in Virginia this Christmas Eve, you do not have to cook every dish yourself. Our two seafood pastas, **Linguini alla Pescatore** and **Shrimp Scampi**, bring four kinds of seafood to the table: shrimp, calamari, mussels and clams. Make a few dishes at home and you have your seven. We do not serve a seven-fish menu, but we can take the pasta course off your hands. Here is how we would plan it from Locust Grove.",
    },
    { type: "h2", text: "What is the Feast of the Seven Fishes?" },
    {
      type: "p",
      text: "It is an Italian-American Christmas Eve tradition. It grew out of **La Vigilia**, the southern Italian Christmas Eve vigil, when Catholic families went without meat and ate seafood instead. Italian immigrants brought the meal to America, and here it picked up the \"seven fishes\" name. In Italy, most families simply call it the Vigil.",
    },
    {
      type: "p",
      text: "The number varies. Seven is the most common, but some families serve nine, eleven or thirteen dishes, and plenty count kinds of seafood rather than plates. People give different reasons for the number seven, and we will not pretend to settle it. What every version shares is a long table, a lot of seafood, and nobody in a hurry to leave.",
    },
    { type: "h2", text: "Planning a Feast of the Seven Fishes in Virginia" },
    {
      type: "p",
      text: "Here is the honest version: our menu has two seafood dishes, and between them they cover four kinds of seafood. The other three come from your own kitchen. That split works well, because the pasta course is the hardest to time and the easiest to hand off. A seven-fish table might look like this:",
    },
    {
      type: "ol",
      items: [
        "**Shrimp.** In our Shrimp Scampi, and in our Linguini alla Pescatore too.",
        "**Calamari.** In the Pescatore.",
        "**Mussels.** In the Pescatore.",
        "**Clams.** In the Pescatore.",
        "**Baccalà (salt cod), made at home.** A Christmas Eve classic. Salt cod needs to soak for a day or more with fresh water changes, so start early in the week.",
        "**Fried smelts, made at home.** Small, crisp and easy to pass around as a starter.",
        "**Your family's pick, made at home.** Baked flounder, crab cakes, Virginia oysters, anchovies on bread: whatever your table looks forward to every year.",
      ],
    },
    {
      type: "p",
      text: "Count it your way. If your family counts plates rather than kinds of seafood, the Pescatore and the Scampi are two dishes, and your kitchen supplies the other five. If you count kinds of seafood, our pastas get you to four. Either way, nobody at the table will be checking your math.",
    },
    {
      type: "image",
      src: "/images/seafood.webp",
      alt: "Linguini pescatore with mussels, clams, shrimp and calamari in marinara on a white plate",
      width: 448,
      height: 500,
      caption: "Linguini alla Pescatore covers four of the seven: shrimp, calamari, mussels and clams.",
    },
    { type: "h2", text: "Our seafood dishes for your Christmas Eve table" },
    {
      type: "p",
      text: "**Linguini alla Pescatore ($21.75)** is linguini with shrimp, calamari, mussels and clams in marinara. Pescatore means fisherman, which makes it a natural fit for the night. It is red, generous and full of shellfish.",
    },
    {
      type: "image",
      src: "/images/scampi.webp",
      alt: "Shrimp scampi: angel hair pasta with shrimp and a sprig of parsley in a white bowl",
      width: 375,
      height: 500,
      caption: "Shrimp Scampi: angel hair with shrimp, garlic, olive oil and white wine.",
    },
    {
      type: "p",
      text: "**Shrimp Scampi ($18.25)** is angel hair with shrimp, garlic, olive oil and white wine. With no tomato, it gives the table a white pasta to sit beside the red one. Prices are from our published menu; check [online ordering](/order) for current prices.",
    },
    {
      type: "p",
      text: "Not everyone at the table eats seafood. To keep the meal meatless in the spirit of the vigil, **Baked Ziti** (penne, ricotta and mozzarella baked in tomato sauce) and **Spaghetti with mushrooms** both fit. We also have salads, desserts and a kids menu for the youngest guests. Browse everything on [our menu](/#our-menu).",
    },
    { type: "h2", text: "Pickup timing on Christmas Eve" },
    {
      type: "p",
      text: "Our holiday hours are not posted yet. Our regular hours are 8 am to 10 pm Monday through Saturday and 8 am to 9 pm on Sunday, but holiday hours can differ, so **call (540) 388-4430 to confirm Christmas Eve hours and pickup times** before you plan your evening around them.",
    },
    {
      type: "ul",
      items: [
        "**Call ahead.** Ask about Christmas Eve hours, how far ahead you can order, and what pickup time to aim for.",
        "**Cook first, pick up last.** Get your baccalà and smelts done, then grab the pasta so it arrives hot.",
        "**Aim for 15 to 30 minutes before the pasta course.** Seafood pasta is at its best fresh, and shrimp and calamari toughen if they sit in a hot oven for long.",
        "**Keep it covered.** Leave the containers closed until you plate, and set out a bowl for mussel and clam shells.",
      ],
    },
    {
      type: "p",
      text: "A simple countdown for the week of Christmas Eve:",
    },
    {
      type: "ol",
      items: [
        "**Early in the week.** Call to confirm Christmas Eve hours and pickup times, and buy your salt cod so it can start soaking.",
        "**The day before.** Shop for smelts and anything else you are cooking, and set the table.",
        "**Christmas Eve afternoon.** Cook the home dishes, fry the smelts last so they stay crisp, and warm your serving bowls.",
        "**Pickup.** Grab the pasta at the time you confirmed, then plate it as soon as you are home.",
      ],
    },
    {
      type: "tip",
      title: "Serve the pasta as its own course",
      text: "Many families eat the Vigil in rounds: fried and cold seafood to start, then pasta, then a baked fish. Put the Pescatore and Scampi out on their own in the middle of the meal so everyone gets them hot.",
    },
    { type: "h2", text: "Feeding a bigger Christmas Eve crowd" },
    {
      type: "p",
      text: "If your table is twenty people instead of six, call us first and talk it through, including whether a larger order is possible on Christmas Eve. Our [catering page](/catering) lists what to have ready, and our [Italian catering party guide](/blog/italian-catering-party-guide-locust-grove) covers headcounts, how much pasta to plan for, and keeping food hot. We are at **4444 Germanna Highway**, a short drive from Lake of the Woods, Wilderness and the rest of the Route 3 corridor.",
    },
    {
      type: "cta",
      title: "Planning your Christmas Eve table?",
      text: "Call (540) 388-4430 to confirm holiday hours and pickup times, or start with our catering page for a bigger crowd.",
      href: "/catering",
      label: "Plan catering",
    },
  ],
  faqs: [
    {
      q: "What is the Feast of the Seven Fishes?",
      a: "An Italian-American Christmas Eve dinner built around seafood. It comes from the southern Italian tradition of La Vigilia, when families ate fish instead of meat on Christmas Eve.",
    },
    {
      q: "Why is it called the Feast of the Seven Fishes?",
      a: "Seven is the most common number, but it varies. Some families serve nine, eleven or thirteen dishes, and people give different explanations for the number seven.",
    },
    {
      q: "What fish are served at the Feast of the Seven Fishes?",
      a: "Common choices include baccalà (salt cod), fried smelts, calamari, clams, mussels and shrimp, though every family's list is different.",
    },
    {
      q: "Is Bella Cucina of the Lake open on Christmas Eve?",
      a: "Holiday hours can differ from our regular hours. Call (540) 388-4430 to confirm Christmas Eve hours and pickup times.",
    },
    {
      q: "Where can I get seafood pasta for Christmas Eve in Locust Grove?",
      a: "Bella Cucina of the Lake at 4444 Germanna Highway makes Linguini alla Pescatore and Shrimp Scampi. Call ahead to confirm Christmas Eve hours and pickup times.",
    },
  ],
  related: ["italian-catering-party-guide-locust-grove", "what-to-order-bella-cucina-locust-grove"],
};

export default post;
