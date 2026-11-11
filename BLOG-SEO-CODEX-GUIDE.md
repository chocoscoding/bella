# Bella Cucina blogs: Codex writing + image guide

This is the playbook for writing blog posts that rank for **Bella Cucina of the Lake (Italian)** and **Bella Cucina Mexican**, and for generating the images each post needs. Section 1 is a prompt you can paste straight into Codex. The rest is the reference it relies on.

| | Italian | Mexican |
|---|---|---|
| Project | `/Users/chocos/cho/WORK/bella caucina/italian` | `/Users/chocos/cho/WORK/bella caucina/mexica` |
| Live domain | https://www.bellacucinalow.com | https://www.bellamexican.com |
| Posts folder | `italian/src/content/blog/` | `mexica/src/content/blog/` |
| Post registry | `italian/src/content/blog/index.ts` | `mexica/src/content/blog/index.ts` |
| Post type + field rules | `italian/src/lib/blog.ts` | `mexica/src/lib/blog.ts` |
| Blog images go in | `italian/public/images/blog/` | `mexica/public/images/blog/` |
| Brand facts | `italian/src/lib/restaurant.ts` | `mexica/src/lib/restaurant.ts` |
| SEO constants | `italian/src/lib/seo.tsx` | `mexica/src/lib/seo.tsx` |
| Example posts | `italian-catering-party-guide-locust-grove.ts`, `what-to-order-bella-cucina-locust-grove.ts` | `mexican-catering-taco-party-guide-locust-grove.ts`, `what-to-order-bella-cucina-mexican-locust-grove.ts` |

Everything else, including metadata, canonical URLs, Open Graph cards, JSON-LD (BlogPosting, BreadcrumbList, FAQPage), the sitemap, RSS, the table of contents and related posts, is **generated automatically from the post file**. A post is one `.ts` file plus one image plus one import line.

---

## 1. Paste-ready Codex prompt

> Replace the bracketed parts. Run once per post.

```text
You are writing one SEO blog post for [Bella Cucina of the Lake (Italian) | Bella Cucina Mexican].

Project: [/Users/chocos/cho/WORK/bella caucina/italian | /Users/chocos/cho/WORK/bella caucina/mexica]
Read first: BLOG-SEO-CODEX-GUIDE.md (in /Users/chocos/cho/WORK/bella caucina), src/lib/blog.ts, src/lib/restaurant.ts,
and both existing posts in src/content/blog/ for tone and structure.

Post to write: [paste one row from the backlog in section 5: slug, title, primary keyword, outline, image prompt]

Do this:
1. Generate the cover image from the image prompt. Save it as public/images/blog/<slug>.webp at 1600x900, WebP, under 250 KB.
   If the outline calls for an inline image, save it as public/images/blog/<slug>-2.webp at 1200x1200.
2. Create src/content/blog/<slug>.ts exporting a `Post` (see the template in section 6 of the guide).
   - 900 to 1,400 words in `body`, 4 to 7 `h2` sections, at least one `tip` block, a `cta` block at the end.
   - 3 to 5 `faqs`, written as the exact questions people type into Google.
   - At least 3 internal links using [text](/path): one to /catering or /order, one to another blog post, one to /#menu or /#our-menu.
   - Only use facts from src/lib/restaurant.ts and section 3 of the guide. Do not invent prices, history, owners, awards,
     delivery, reservations, reviews, or dietary claims. If a section needs a fact we don't have, write around it.
   - datePublished = today's date (YYYY-MM-DD).
3. Register the post: add one import and add it to the `posts` array in src/content/blog/index.ts.
4. Run `npx tsc --noEmit` and `npm run build` in the project. Fix anything that fails.
5. Report: the URL path, title tag length, meta description length, word count, the image path(s), and the image prompt used.
```

---

## 2. How these posts rank (strategy)

A restaurant blog will not beat recipe giants for "baked ziti recipe". It **can** win searches with local intent, where the restaurant is the answer. Every post should do at least one of these:

1. **Answer a local, high-intent question.** "Italian catering Locust Grove VA", "Mexican food near Lake of the Woods", "where to eat after visiting Wilderness Battlefield".
2. **Help someone plan something we can supply.** Party catering, office lunches, holiday dinners, game-day spreads. These convert to calls.
3. **Explain the menu.** "What is Linguini alla Pescatore?", "Enchiladas vs burritos". These capture curious searchers and lead to the order page.
4. **Ride the calendar.** Super Bowl, Mother's Day, graduation season, Cinco de Mayo, Christmas Eve, Feast of the Seven Fishes, back-to-school. Publish 4–6 weeks ahead.

### Topic clusters (build these, link inside them)

Each site gets three pillar topics. Every new post links **up** to its pillar page and **across** to one sibling post.

| Cluster | Pillar page | Spoke posts link to it with anchor text like |
|---|---|---|
| Catering | `/catering` + the catering guide post | "Italian catering in Locust Grove", "plan your taco bar" |
| Menu guides | The "what to order" post | "our menu guide", "what to order at Bella" |
| Local guides | First local-guide post you publish (e.g. Lake of the Woods) | "things to do near Lake of the Woods" |

### Rules that keep rankings clean

- **One primary keyword per post.** Before writing, read the `keywords[0]` of every existing post. If the new primary keyword overlaps, pick a different angle; two posts competing for one query hurts both.
- **Never publish the same article on both sites.** The two restaurants share an address. Duplicate or near-duplicate posts across the two domains will cannibalize each other. Same topic is fine (both can do "office lunch catering"), but with different angles, dishes, outlines and FAQs.
- **People Also Ask → FAQs.** Search the primary keyword, copy the shape of the PAA questions, answer each in 1–3 sentences.
- **Front-load the answer.** The first paragraph answers the title's promise in plain language. Google pulls snippets from there.
- **Specific beats generic.** Name real dishes from `restaurant.ts`, real roads (Germanna Highway, Route 3), real neighbors (Lake of the Woods, Wilderness, Fredericksburg, Culpeper, Orange, Spotsylvania).
- **Refresh, don't pile up.** When a post is 6+ months old, update facts and set `dateModified`. That date flows into the sitemap, JSON-LD and Open Graph.
- **Cadence:** 2 posts per month per site beats 10 in one week.

---

## 3. Facts Codex may use (and may not)

### Italian: Bella Cucina of the Lake
- 4444 Germanna Highway, Locust Grove, VA 22508 · (540) 388-4430
- Hours: Mon–Sat 8:00 am–10:00 pm · Sun 8:00 am–9:00 pm
- Menu facts (from the published menu, prices may change, always say "check online ordering for current prices"):
  Spaghetti $14.75 (meatballs, sausage or mushrooms) · Baked Ziti $14.75 (penne, ricotta, mozzarella, tomato sauce) ·
  Linguini alla Pescatore $21.75 (shrimp, calamari, mussels, clams, marinara) · Shrimp Scampi $18.25 (angel hair, garlic, olive oil, white wine) ·
  pepperoni pizza, subs, salads, a kids menu, desserts.
- Catering exists: phone first, page at `/catering`. Online ordering for pickup at `/order`.

### Mexican: Bella Cucina Mexican
- 4444 Germanna Highway, Locust Grove, VA 22508 · (540) 412-5009
- Hours: Mon–Sat 11:00 am–10:00 pm · Sun 11:00 am–9:00 pm
- Dishes (no prices on file, so don't print prices): Tacos · Loaded nachos · Shrimp & rice · Burrito el Grande · Enchiladas · Grilled chicken ·
  Steak Mexicano · Fiesta chicken salad · Carnitas. Descriptions live in `mexica/src/lib/restaurant.ts`.
- The dining room: yellow and blue walls, papel picado, warm wood booths, black chairs.
- Catering exists: phone first, page at `/catering`. Online ordering for pickup at `/order`.

### Never claim (unless the owner confirms it and it's added to `restaurant.ts`)
Founding year, family history, owner or chef names, awards, "best in Virginia", delivery, reservations, private rooms, bar/alcohol, gluten-free / vegan / allergen safety, catering minimums or tray sizes, prices not listed above, review quotes, star ratings.
Local places (distances, hours, events) must be checked before publishing; phrase distances as "a short drive" unless verified.

> **Biggest E-E-A-T win available:** get one real person's name and role (owner or chef) and put it in `author: { name, role, url }`. The page then emits a `Person` author. Until then the author is the kitchen team.

---

## 4. Image spec (for Codex image generation)

| | Cover | Inline (optional) |
|---|---|---|
| Path | `<project>/public/images/blog/<slug>.webp` | `<project>/public/images/blog/<slug>-2.webp` |
| Size | 1600 × 900 (16:9) | 1200 × 1200 (square) |
| Format | WebP, quality ~80, ≤ 250 KB | WebP, ≤ 200 KB |
| In the post | `cover: { src: "/images/blog/<slug>.webp", alt, width: 1600, height: 900 }` | `{ type: "image", src, alt, width: 1200, height: 1200, caption }` |

The cover appears on the blog index, the article header, the image sitemap and JSON-LD. Social cards (Open Graph) are generated automatically from the title, so **don't put text in images.**

**Italian look:** warm trattoria realism, red / cream / mustard-yellow palette, rustic wood and linen, natural window light, shallow depth of field, generous portions, steam, basil. Reference for consistency: `italian/public/images/italian-shared-table.webp`, `italian/public/images/exterior.webp`.

**Mexican look:** bright and festive, the real dining room (yellow and blue walls, papel picado, warm wood booths, black chairs), orange and marigold accents, round plates shot from slightly above, lime, cilantro. Reference images to attach: `mexica/public/films/mexican-salon.jpg`, `mexica/public/images/catering-celebration.webp`, any of `mexica/public/images/plates/*.jpg`.

**Every prompt ends with:** `Photorealistic editorial food photography. No text, no logos, no signage, no watermarks, no menus with writing. Natural hands, believable food texture, no extra fingers.`

**Honesty rule:** generated images are illustrative. Use them for scenes and atmosphere (tables, gatherings, seasons). For a post about one specific dish, prefer the real photos already in `public/images/` (Italian) or `public/images/plates/` (Mexican) and only generate the cover.

---

## 5. Post backlog

Write top to bottom; earlier posts are the pillars later ones link to. Each row is ready to paste into the prompt in section 1.

### Italian (`/Users/chocos/cho/WORK/bella caucina/italian`)

**I-1 · `italian-restaurant-near-lake-of-the-woods`**
- Title: Italian Food Near Lake of the Woods: Your Guide to Bella Cucina
- Primary keyword: Italian restaurant near Lake of the Woods VA · Category: Local guides (pillar)
- Outline: getting here from the Lake (Route 3) · dine-in vs pickup · what to order after a day on the water · bringing a group · hours
- FAQs: Is there an Italian restaurant near Lake of the Woods? · Do they have takeout? · Is it kid-friendly? · What time do they open?
- Cover prompt: *A sunlit early-evening scene of a casual Italian restaurant table by a large window, overlooking a calm Virginia lake shoreline with trees, plates of spaghetti and a pepperoni pizza, red and cream checked linen, two glasses of iced tea, warm golden light.* + standard ending.

**I-2 · `office-lunch-catering-locust-grove-fredericksburg`**
- Title: Office Lunch Catering in Locust Grove: Italian That Feeds the Whole Team
- Primary keyword: office lunch catering Locust Grove · Category: Catering
- Outline: why pasta works for teams · how much per person · vegetarian options on the menu · pickup timing for a noon meeting · how to order by phone
- FAQs: How much pasta do I order for 20 people? · Can I pick up before 11? (we open at 8 am) · What's easiest to serve at work?
- Cover prompt: *A bright modern office break room table set with aluminum catering trays of baked ziti, spaghetti and meatballs, a large green salad and garlic bread, paper plates and napkins, coworkers' hands reaching in, daylight from windows.* + standard ending.

**I-3 · `what-is-linguini-alla-pescatore`**
- Title: What Is Linguini alla Pescatore? The Fisherman's Pasta, Explained
- Primary keyword: what is linguini pescatore · Category: Menu guides
- Outline: name meaning (pescatore = fisherman) · what's in ours (shrimp, calamari, mussels, clams, marinara) · how it differs from scampi · what to pair · order it
- FAQs: What does pescatore mean? · Is pescatore spicy? · Pescatore vs. scampi?
- Cover prompt: *Overhead close-up of a wide white bowl of linguini with shrimp, calamari rings, mussels and clams in a bright tomato marinara, parsley, a lemon wedge, rustic wooden table, soft side light.* + standard ending.

**I-4 · `shrimp-scampi-vs-pescatore`**
- Title: Shrimp Scampi vs. Pescatore: Which Seafood Pasta Should You Order?
- Primary keyword: shrimp scampi vs pescatore · Category: Menu guides
- Outline: white-wine garlic vs. red marinara · lighter vs. heartier · price difference (from section 3) · who should order which
- Cover: use existing `/images/scampi.webp` and `/images/seafood.webp` inline; generate a cover: *Two pasta plates side by side on a cream tablecloth, left angel hair with garlicky shrimp and olive oil, right linguini with mixed seafood in red sauce, overhead.* + standard ending.

**I-5 · `how-much-pasta-per-person-for-a-party`**
- Title: How Much Pasta Per Person for a Party? A Caterer's Cheat Sheet
- Primary keyword: how much pasta per person for a party · Category: Catering
- Outline: buffet vs. plated · adults vs. kids · when you have two mains · leftovers math · or let us plan it (/catering)
- Cover prompt: *A long party buffet table with deep trays of baked pasta, a bowl of salad, bread basket and stacked plates, guests blurred in the background of a home living room, warm lamp light.* + standard ending.

**I-6 · `feast-of-the-seven-fishes-locust-grove`** (publish by early December)
- Title: Feast of the Seven Fishes in Locust Grove: A Christmas Eve Guide
- Primary keyword: Feast of the Seven Fishes Virginia · Category: Seasonal
- Outline: the tradition · building a seven-fish table from seafood dishes on our menu · pickup timing on Christmas Eve (call to confirm holiday hours) · FAQ
- Cover prompt: *A festive Christmas Eve Italian table with several seafood dishes: shrimp pasta, mussels, calamari, clams, candles, red napkins, pine sprigs, warm low light.* + standard ending.

**I-7 · `family-friendly-italian-restaurant-locust-grove`**
- Title: Family Dinner in Locust Grove: Why Kids (and Parents) Love Italian Night
- Primary keyword: family friendly restaurant Locust Grove · Category: Local guides
- Outline: kids menu · pizza to share · early open (8 am) · picking up for a busy weeknight · birthday ideas
- Cover prompt: *A cheerful family of four sharing pizza and spaghetti at a casual Italian restaurant booth, kids laughing, red and cream decor, natural light, candid.* + standard ending.

**I-8 · `things-to-do-near-wilderness-battlefield-and-where-to-eat`**
- Title: Visiting Wilderness Battlefield? Where to Eat Nearby on Route 3
- Primary keyword: where to eat near Wilderness Battlefield · Category: Local guides
- Outline: a day around the battlefield (verify facts) · Germanna Highway route · lunch or dinner stop · pickup for a picnic
- Cover prompt: *A quiet rural Virginia two-lane road at golden hour with split-rail fence and autumn trees, a takeout bag with Italian food and a pizza box resting on a picnic blanket in the foreground.* + standard ending.

**I-9 · `graduation-party-catering-orange-county-va`** (publish April)
- Title: Graduation Party Catering in Orange County, VA: Feed the Crowd Italian-Style
- Primary keyword: graduation party catering Orange County VA · Category: Catering
- Cover prompt: *A backyard graduation party table with trays of baked ziti and pizza, balloons in school colors, a graduation cap on the table, string lights, late-afternoon sun.* + standard ending.

**I-10 · `game-day-pizza-and-pasta-orders`** (publish January)
- Title: Game Day Food in Locust Grove: Pizza, Pasta and Subs for the Big Game
- Primary keyword: game day food Locust Grove · Category: Seasonal
- Cover prompt: *A living room coffee table loaded with pizza boxes, a tray of baked ziti, sub sandwiches and napkins, a TV glow and blurred fans in the background.* + standard ending.

### Mexican (`/Users/chocos/cho/WORK/bella caucina/mexica`)

**M-1 · `mexican-restaurant-near-lake-of-the-woods`**
- Title: Mexican Food Near Lake of the Woods: Your Guide to Bella Cucina Mexican
- Primary keyword: Mexican restaurant near Lake of the Woods VA · Category: Local guides (pillar)
- Outline: getting here on Route 3 · the colorful dining room · first-visit orders · groups and families · hours
- Cover prompt (attach `mexica/public/films/mexican-salon.jpg`): *The real colorful dining room with yellow and blue walls and papel picado, a booth table with tacos, loaded nachos and lime wedges, afternoon light.* + standard ending.

**M-2 · `taco-bar-catering-how-much-per-person`**
- Title: Taco Bar Catering: How Much to Order Per Person (With a Cheat Sheet)
- Primary keyword: taco bar catering how much per person · Category: Catering
- Outline: tacos per adult/kid · toppings math · chips go fast · sides · let us plan it (/catering)
- Cover prompt: *A build-your-own taco bar on a long table: warm tortillas, bowls of seasoned meat, pico de gallo, cilantro, onions, lime, cheese, guacamole, chips, colorful napkins, party guests' hands.* + standard ending.

**M-3 · `enchiladas-vs-burritos`**
- Title: Enchiladas vs. Burritos: What's the Difference, and Which Should You Order?
- Primary keyword: enchiladas vs burritos · Category: Menu guides
- Outline: rolled & sauced vs. wrapped & handheld · ours (Enchiladas, Burrito el Grande) · which travels better · order
- Cover: inline existing `/images/plates/enchiladas.jpg` and `/images/plates/burrito.jpg`; generate cover: *Two round plates side by side from above: saucy cheese-topped enchiladas with rice and lettuce, and a large burrito with rice, beans and pico de gallo, orange tabletop.* + standard ending.

**M-4 · `cinco-de-mayo-locust-grove`** (publish early April)
- Title: Cinco de Mayo in Locust Grove: Party Food, Catering and Pickup Ideas
- Primary keyword: Cinco de Mayo Locust Grove VA · Category: Seasonal
- Outline: what the day is (briefly, accurately) · party-at-home menu · catering lead time · pickup tips
- Cover prompt: *A festive home party table with papel picado overhead, platters of tacos and nachos, marigolds in a vase, bright orange and blue accents, friends' hands raising glasses of agua fresca.* + standard ending.

**M-5 · `game-day-nachos-and-taco-catering`** (publish January)
- Title: Game Day Catering: Nachos, Tacos and a Spread Everyone Fights Over
- Primary keyword: game day catering near me Locust Grove · Category: Catering
- Cover prompt: *A coffee table spread of loaded nachos, a taco platter and salsa in front of a TV glow, football fans blurred in the background, warm living-room light.* + standard ending.

**M-6 · `office-lunch-mexican-catering-culpeper-fredericksburg`**
- Title: Office Lunch Catering That Isn't Sandwiches: Mexican for the Whole Team
- Primary keyword: Mexican catering for office lunch · Category: Catering
- Outline: why build-your-own works at work · Fiesta chicken salad for lighter eaters · noon pickup timing · per-person math
- Cover prompt: *A conference room table with foil trays of grilled chicken, rice, beans, tortillas, a big salad with avocado, and coworkers serving themselves, bright daylight.* + standard ending.

**M-7 · `what-is-carnitas`**
- Title: What Is Carnitas? Golden, Tender Pork, Explained
- Primary keyword: what is carnitas · Category: Menu guides
- Inline: existing `/images/plates/carnitas.jpg`. Cover prompt: *Close-up of golden crispy shredded pork with rice, beans, warm tortillas and lime on a round plate, papel picado softly blurred behind.* + standard ending.

**M-8 · `birthday-party-mexican-catering-orange-county-va`**
- Title: Birthday Party Catering in Orange County, VA: The Mexican Food Edition
- Primary keyword: birthday party catering Orange County VA · Category: Catering
- Cover prompt (attach `mexica/public/images/catering-celebration.webp`): *A backyard birthday party with a taco and nacho buffet, a small cake with candles, string lights and papel picado, friends of varied ages laughing.* + standard ending.

**M-9 · `best-mexican-dishes-for-sharing`**
- Title: Made to Share: The Best Mexican Dishes for a Group Dinner
- Primary keyword: Mexican food for a group dinner · Category: Menu guides
- Cover prompt: *A group of six friends at a wooden booth passing loaded nachos, tacos and steak with peppers, the real yellow-and-blue dining room, candid laughter.* + standard ending.

**M-10 · `graduation-party-taco-bar`** (publish April)
- Title: Graduation Party Taco Bar: A Simple Plan for a Big Crowd
- Primary keyword: graduation party taco bar · Category: Catering
- Cover prompt: *An outdoor graduation party with a taco bar under a canopy, a graduation cap on the table, balloons, late-afternoon golden light.* + standard ending.

---

## 6. Post file template

`src/content/blog/<slug>.ts` (identical shape in both projects; the Mexican one also accepts `ogPlate`).

```ts
import type { Post } from "@/lib/blog";

const post: Post = {
  slug: "office-lunch-catering-locust-grove-fredericksburg",           // = file name = URL
  title: "Office Lunch Catering in Locust Grove: Italian That Feeds the Whole Team", // H1, natural language
  seoTitle: "Office Lunch Catering in Locust Grove, VA | Bella Cucina",  // <title>: 50–60 chars, keyword first
  description: "…",          // 140–160 chars, keyword + concrete benefit + soft CTA
  excerpt: "…",              // 1–2 sentences for cards and the article dek
  category: "Catering",      // Catering | Menu guides | Local guides | Seasonal
  tags: ["catering", "office lunch"],
  keywords: ["office lunch catering Locust Grove", "…secondary", "…local variant"], // primary FIRST
  datePublished: "2026-11-11",
  // dateModified: "2027-03-02",   // add when you refresh the post
  author: { name: "Bella Cucina Kitchen", role: "The team at Bella Cucina of the Lake" },
  cover: { src: "/images/blog/office-lunch-catering-locust-grove-fredericksburg.webp", alt: "…describe the image literally…", width: 1600, height: 900 },
  // ogPlate: "nachos",       // Mexican only: plate photo on the social card (tacos, nachos, burrito, enchiladas, …)
  body: [
    { type: "p", text: "Answer the title's promise in the first two sentences. Use **bold** sparingly and [links](/catering)." },
    { type: "h2", text: "Section heading with a natural keyword variant" },
    { type: "p", text: "…" },
    { type: "ul", items: ["**Lead-in.** Detail.", "…"] },
    { type: "tip", title: "Short tip title", text: "One practical tip." },
    { type: "image", src: "/images/blog/<slug>-2.webp", alt: "…", width: 1200, height: 1200, caption: "…" },
    { type: "quote", text: "…", cite: "…" },             // only real, attributable quotes
    { type: "cta", title: "…", text: "…", href: "/catering", label: "Plan catering" },
  ],
  faqs: [{ q: "Question exactly as people search it?", a: "1–3 sentence answer." }],
  related: ["what-to-order-bella-cucina-locust-grove"], // slugs of sibling posts
};

export default post;
```

Then in `src/content/blog/index.ts`:

```ts
import officeLunch from "./office-lunch-catering-locust-grove-fredericksburg";
export const posts: Post[] = [/* …existing…, */ officeLunch];
```

---

### Drafts

Add `draft: true` to a post to keep it unpublished.
- **Where drafts show:** in `npm run dev`, marked with a black "Draft" tag, and in any build run with `SHOW_DRAFTS=1`, where they also get a `noindex` tag.
- **Where drafts never show:** production builds. A draft has no page there (404), no blog-index card, and no sitemap, RSS or related-post entry.
- **Links between drafts:** never link one draft to another. When only one of them is published, the link 404s.

Drafts written so far use a **temporary real photo** as the cover. Above each `cover` is a `// DRAFT COVER` comment with the image to generate, its path and its prompt. To publish a draft:
1. Generate the cover from the prompt in the `// DRAFT COVER` comment. Save it at the path given there.
2. Point `cover` at the new file: `src`, `width: 1600`, `height: 900`, and a new `alt`. Then delete the comment.
3. Delete `draft: true`. Set `datePublished` to the publish date.
4. Optionally, add links to sibling posts that are now published.
5. Run `npx tsc --noEmit && npm run build` and deploy.

## 7. Per-post SEO checklist

- [ ] `seoTitle` 50–60 characters, primary keyword in the first half, brand at the end if it fits
- [ ] `description` 140–160 characters, includes the keyword and "Locust Grove" (or the target town)
- [ ] Primary keyword appears in: `title`, first paragraph, one `h2`, image `alt`, `slug`
- [ ] Slug is short, lowercase, hyphenated, no dates, no stop-word padding
- [ ] 3+ internal links (pillar page, sibling post, /order or /catering); 0–2 external links to authoritative sources (e.g. nps.gov for battlefield facts)
- [ ] Cover image saved, ≤ 250 KB, literal `alt` text, no text in the image
- [ ] FAQs mirror real "People also ask" questions
- [ ] No facts outside section 3; no prices on Mexican posts
- [ ] `npx tsc --noEmit` and `npm run build` pass; `/blog/<slug>` renders; post appears in `/sitemap.xml` and `/blog/rss.xml`

---

## 8. One-time launch tasks (owner)

1. **Search Console + Bing Webmaster Tools:** verify both domains. Set `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` env vars in each Vercel project. The layouts already emit the meta tags. Submit `https://www.bellacucinalow.com/sitemap.xml` and `https://www.bellamexican.com/sitemap.xml`.
2. **Set `SITE_URL`** in each Vercel project if a domain ever changes (defaults are the two domains above).
3. **Google Business Profile:** confirm each profile's website field points at its own domain, then share each new post as a GBP update linking to it. This is the fastest local signal you control.
4. **Validate structured data** once live: https://search.google.com/test/rich-results with a post URL and the home page.
5. **Confirm the shared address.** Both sites list 4444 Germanna Highway. If the Mexican location differs, update `mexica/src/lib/restaurant.ts` before launch; it feeds every schema block.
