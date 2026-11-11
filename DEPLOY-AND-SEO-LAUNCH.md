# Deploy and SEO launch: Bella Cucina (Italian + Mexican)

Checked 2026-11-11. Both apps pass `tsc` and `next build` with no warnings. Production output is correct: canonicals, og:image, JSON-LD, sitemap, robots, RSS, the `/v1` → `/` redirect and 404s.

| | Italian | Mexican |
| --- | --- | --- |
| Folder | `/Users/chocos/cho/WORK/bella caucina/italian` | `/Users/chocos/cho/WORK/bella caucina/mexica` |
| Vercel project | `morolas-projects/bellaofthelake` | `morolas-projects/bellamexican` |
| Domain | https://www.bellacucinalow.com | https://www.bellamexican.com |
| Live now | old build (home 307 → `/v1`) | old build (no blog/catering) |
| Blog posts | 2 | 3 (incl. Codex's Lake of the Woods post) |

---

## 1. Before you deploy

- [ ] **Confirm the address.** Both sites say 4444 Germanna Highway, Locust Grove, VA 22508.
  - Every JSON-LD block, the catering pages and the posts read it from `src/lib/restaurant.ts` in each app.
  - A wrong address here hurts local ranking more than anything else on this list.
- [ ] **Confirm hours and phones.**
  - Italian: Mon–Sat 8–10, Sun 8–9, (540) 388-4430.
  - Mexican: Mon–Sat 11–10, Sun 11–9, (540) 412-5009.
- [x] **Online ordering goes to Froogle for now.** `src/lib/ordering-mode.ts` in each app controls it.
  - **While `NEXT_PUBLIC_ORDER_API_URL` is unset:**
    - Every Order button, blog link and the Restaurant `OrderAction` point to the Froogle menu.
    - `/order` temporarily (307) redirects there.
    - `/order` is left out of the sitemap.
  - **To switch back to the built-in `/order` page:**
    1. Deploy `api/`.
    2. Set the variable on both Vercel projects.
    3. Redeploy. No code change is needed.
- [ ] *(Optional)* Add a real owner or chef as the post author in `src/content/blog/*.ts` (`author.name`, `author.role`). It's a trust signal for Google.

## 2. Environment variables (Vercel → Project → Settings → Environment Variables, Production)

| Variable | Needed? | Value |
| --- | --- | --- |
| `SITE_URL` | No: it already defaults to each production domain | Leave unset |
| `GOOGLE_SITE_VERIFICATION` | Only for the HTML-tag method (DNS verification is better, see §4) | the `content` value from Search Console |
| `BING_SITE_VERIFICATION` | Optional (you can import from Google instead) | the `content` value from Bing |
| `NEXT_PUBLIC_ORDER_API_URL` | Leave unset until the ordering API is deployed (Order buttons use Froogle meanwhile) | e.g. `https://api.bellacucinalow.com` |

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after you change one.

## 3. Deploy

From each app folder (both are already linked to Vercel). Italian:

```bash
cd "/Users/chocos/cho/WORK/bella caucina/italian" && vercel --prod
```

Mexican:

```bash
cd "/Users/chocos/cho/WORK/bella caucina/mexica" && vercel --prod
```

Smoke test once both are live:

```bash
for u in https://www.bellacucinalow.com https://www.bellamexican.com; do for p in / /v1 /catering /blog /sitemap.xml /robots.txt /blog/rss.xml /opengraph-image; do printf "%s " "$(curl -s -o /dev/null -w '%{http_code}' $u$p)"; echo "$u$p"; done; done
```

Expect `200` on everything. Expect `308` on Italian `/v1`. `/order` returns `307` to Froogle while online ordering is on Froogle. Mexican `/v1` will be `404`, which is correct because the route never existed there.

## 4. Search engines (do it the day you deploy)

**Google Search Console:** https://search.google.com/search-console
1. Add a **Domain property** for `bellacucinalow.com` and one for `bellamexican.com`.
   - Verify each with the DNS TXT record. That covers www and the bare domain, so you don't need an env var.
2. Sitemaps → submit `https://www.bellacucinalow.com/sitemap.xml` and `https://www.bellamexican.com/sitemap.xml`.
3. URL Inspection → **Request indexing** for:
   - `/`
   - `/catering`
   - `/blog`
   - each post URL
4. Check for the old URLs. Pages → "Page with redirect" should list `/v1` and `/v2` on the Italian site. That's expected.

**Bing Webmaster Tools:** https://www.bing.com/webmasters
- Import both sites from Search Console. This also covers DuckDuckGo and ChatGPT search.

**Rich results check:** https://search.google.com/test/rich-results
- Test the home page. Expect Restaurant.
- Test a post. Expect Article, Breadcrumb and FAQ.
- Google only shows FAQ rich results for some sites, but the markup still helps AI answers.

**Share preview check:** paste a post URL into https://www.opengraph.xyz. The branded card should render.

## 5. Google Business Profile (the biggest local lever)

For **each** restaurant:
- [ ] Name, address and phone match the website exactly (see §1).
- [ ] Website field:
  - The Italian profile uses `https://www.bellacucinalow.com/`.
  - The Mexican profile uses `https://www.bellamexican.com/`.
  - Two separate profiles at the same address need separate listings, with suite or unit numbers if you have them, so Google doesn't merge them.
- [ ] Menu link → `/#menu`. Order link → the restaurant's Froogle menu, or `/order`, which forwards to Froogle now and will keep working once the built-in ordering is live.
- [ ] Add catering as a service and link it to `/catering`.
- [ ] Post each new blog article as a GBP update with its cover image.
- [ ] Ask happy customers for reviews. Reply to every review.

## 6. Citations and links (week 1–2)

- Make the name, address and phone identical on Yelp, Apple Maps (Business Connect), Bing Places, Facebook, TripAdvisor and the Lake of the Woods / Locust Grove community directories.
- Once social profiles exist, add their URLs to `sameAs` in `src/lib/seo.tsx`. Mexican is empty now. Italian has whatever it shipped with.
- Cross-link the two sites:
  - The Italian "Visit us" or footer links to Bella Mexican.
  - The Mexican site links back to the Italian one.
  - Same owner and same address make this a natural link.

## 7. Content cadence (ongoing)

- Publish **1 post per site every 1–2 weeks** from the backlog in `BLOG-SEO-CODEX-GUIDE.md` (I-1…I-10, M-1…M-10).
  - Run the guide's Codex prompt.
  - After each post: run `npm run build`, deploy, then request indexing in Search Console.
- Bump `dateModified` only when you really change a post.
- After 6–8 weeks, open Search Console → Performance → Queries. Look for queries with impressions in positions 8–20. Update or expand those posts first; that's the fastest win.

## Known non-issues

- `italian/public/images/hero-supplied-pour.png` is the old v1 hero. Nothing uses it, and it's safe to delete.
- Mexican share images use `public/fonts/og-crnch-artwork.otf`, a copy of Crnch with one font table removed because the share-image generator can't read it. The site's own fonts are unchanged.
- If the Mexican dev server is already running when a new post file is added, the post can 404 until you restart it. Production builds are unaffected.
