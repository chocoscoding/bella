import type { Post } from "@/lib/blog";
// Register every post here. One import per file in this folder; order does not matter.
import italianCateringPartyGuide from "./italian-catering-party-guide-locust-grove";
import whatToOrder from "./what-to-order-bella-cucina-locust-grove";

// Drafts (`draft: true`): visible in `next dev`, left out of production builds.
import lakeOfTheWoods from "./italian-restaurant-near-lake-of-the-woods";
import officeLunch from "./office-lunch-catering-locust-grove-fredericksburg";
import pastaPerPerson from "./how-much-pasta-per-person-for-a-party";
import whatIsPescatore from "./what-is-linguini-alla-pescatore";
import scampiVsPescatore from "./shrimp-scampi-vs-pescatore";
import sevenFishes from "./feast-of-the-seven-fishes-locust-grove";

export const posts: Post[] = [
  italianCateringPartyGuide,
  whatToOrder,
  lakeOfTheWoods,
  officeLunch,
  pastaPerPerson,
  whatIsPescatore,
  scampiVsPescatore,
  sevenFishes,
];
