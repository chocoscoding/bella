# Bella Cucina Mexican — standalone Next.js app

An independent app based on the supplied **CrNch — Fast Food & Burger Restaurant Website UI Kit.fig** desktop landing page (frame `5:447`) and mobile frame (`5:1896`). It does not import files from the older Bella Cucina app.

## Run

Project location: `/Users/chocos/cho/WORK/bella caucina/mexica`.

```sh
npm install
npm run dev
```

Preview: http://localhost:3001

```sh
npm run typecheck
npm run build
npm start
```

Next.js 16 App Router, React 19, TypeScript, local CSS, locally hosted assets. The production build uses webpack.

## Pages, blog and SEO

Live domain: https://www.bellamexican.com (override with `SITE_URL`).

- `/catering`: catering splash page (photo + phone contact).
- `/blog`, `/blog/[slug]`: posts live in `src/content/blog/` and are registered in `src/content/blog/index.ts`.
- `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml`, and generated `opengraph-image` cards (`src/lib/og.tsx`).
- SEO constants and JSON-LD builders: `src/lib/seo.tsx`. Shared header/footer for inner pages: `src/ordering/site-header.tsx`, `src/components/site-footer.tsx`.
- Writing new posts (and generating their images): see `../BLOG-SEO-CODEX-GUIDE.md`.

## Editing

- `src/components/home.tsx`: page sections, mobile menu, category filtering, dish rail, FAQ and motion controls.
- `src/components/reveal-text.tsx`: accessible word-by-word masked heading reveals.
- `src/components/room-journey.tsx`: expanding dining-room frame and rising invitation, with a static reduced-motion fallback.
- `src/app/globals.css`: responsive layout, reference palette and motion.
- `src/lib/restaurant.ts`: business links, temporary shared address, menu copy.
- `public/images/plates`: supplied restaurant food photography.
- `public/films`: supplied dining-room footage and posters.
- `public/fonts`: local type assets and license files.

## Design mapping

The template's inset dark navigation, oversized orange food-collage hero, four-column menu shelf, centered oversized manifesto, asymmetric story block, pastel product rail, split image/color feature, orange editorial section, three colored panels, lavender closing card and dark footer are translated into responsive components.

The Mexican content replaces the kit's burger/packaged-product imagery. Mexican touches are limited to food, warm colors, green accents, a floral motif and short welcome copy. Template-only discounts, testimonials, social handles and newsletter claims are not published as facts about Bella Cucina. Their section layouts are used for visit/catering information and practical links instead. There is no newsletter backend or checkout in this app; ordering and catering use the restaurant's existing services.

`crnch-artwork.otf` is a project-specific rendering subset reconstructed from letter outlines embedded in the supplied Figma file, not the complete original font. It preserves the actual supplied Chunk display lettering for the available uppercase characters. Bricolage provides body text and fallback characters. Keep use of the supplied design assets within the terms of your UI-kit license.

The address is the same temporary address already approved for the current Mexican concept. Confirm it before launching a production site.

## Accessibility and performance

Semantic headings, keyboard-visible focus, skip link, labeled category controls, accessible FAQ state, Escape-close mobile navigation and a reduced-motion preference. Scroll reveals use IntersectionObserver. Video plays only in view and pauses when motion is disabled. The dining-room frame expands in a short sticky scroll sequence; the video plays normally rather than seeking on scroll. The invitation rises over the footage. Motion controls and reduced-motion preferences replace the sequence with a normal document flow.

## Related existing variant

The original Bella Cucina app and its `/mexican/v11` variant remain in the previous workspace at `/Users/chocos/Documents/Codex/2026-10-20/bu/outputs/bella-cucina`. This project runs independently and does not require that app or workspace.

No deployment was performed.
