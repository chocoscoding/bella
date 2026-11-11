# Bella Cucina of the Lake (Italian)

Live domain: https://www.bellacucinalow.com (override with `SITE_URL`).

## Pages

- `/`: home page with the pizza hero. The old comparison routes `/v1` and `/v2` permanently redirect here.
- `/catering`: catering splash page (photo + phone contact).
- `/blog`, `/blog/[slug]`: the Bella Cucina Journal. Posts live in `src/content/blog/` and are registered in `src/content/blog/index.ts`.
- `/order`, `/order/status`: online ordering.
- `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml`, and generated `opengraph-image` cards for every page.

SEO constants and JSON-LD builders: `src/lib/seo.tsx`. Business facts: `src/lib/restaurant.ts`.
Writing new posts (and generating their images): see `../BLOG-SEO-CODEX-GUIDE.md`.

```bash
npm install
npm run dev
```
