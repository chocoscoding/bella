import type { Post } from "@/lib/blog";
// Register every post here. One import per file in this folder; order does not matter.
import mexicanCateringGuide from "./mexican-catering-taco-party-guide-locust-grove";
import whatToOrder from "./what-to-order-bella-cucina-mexican-locust-grove";
import lakeOfTheWoods from "./mexican-restaurant-near-lake-of-the-woods";

// Drafts (`draft: true`): visible in `next dev`, left out of production builds.
import tacoBarPerPerson from "./taco-bar-catering-how-much-per-person";
import gameDay from "./game-day-nachos-and-taco-catering";
import officeLunch from "./office-lunch-mexican-catering-culpeper-fredericksburg";
import enchiladasVsBurritos from "./enchiladas-vs-burritos";
import whatIsCarnitas from "./what-is-carnitas";
import sharing from "./best-mexican-dishes-for-sharing";

export const posts: Post[] = [
  lakeOfTheWoods,
  mexicanCateringGuide,
  whatToOrder,
  tacoBarPerPerson,
  gameDay,
  officeLunch,
  enchiladasVsBurritos,
  whatIsCarnitas,
  sharing,
];
