# Bella Cucina ordering API

One TypeScript + Express backend for both restaurants (`italian`, `mexican`), built on Clover:
inventory, customers, merchant, orders and payments (REST v3), plus the Ecommerce API and Hosted Checkout.

```bash
npm install
npm run seed      # sandbox only: writes test menus; refuses production and real (untagged) merchants
npm run dev       # http://localhost:4000 (tsx watch)
npm test          # pricing, pickup slots, webhook signatures, validators
npm run build && npm start
```

Credentials live in `.env` (see `.env.example`). It is set to the **live** merchants
(Bella Cucina of the Lake `PZ5AD807DM901`, Bella Cucina Mexican `MMPQ2357R52M1`) with
`ORDERING_ENABLED=false`: menus sync from Clover, but `POST /orders` is refused before any Clover call,
and the sites show "call to order". The old sandbox settings are kept, commented out, at the bottom of `.env`.

### Which Clover items go online
Each live POS carries both cuisines plus bar and system categories, so each site keeps only:
visible, fixed-price, non-zero items in a category not matched by the brand's exclude pattern
(Italian drops `Mexican …`; Mexican drops Italian, pizza, subs, burgers, soups; both drop alcohol,
happy hour, print options and order-integration categories) and without a `Liquor`/`Beer`/`Wine` tag.
Override with `ITALIAN_MENU_EXCLUDE` / `MEXICAN_MENU_EXCLUDE` / `MENU_EXCLUDE_TAGS`.

## Layout

```
src/
  app.ts, server.ts      Express app and entry point
  config/                brands, Clover hosts, env
  types/                 brand, clover (API shapes), menu, order, express augmentation
  routes/                URL → validators → controller
  validators/            express-validator rules (shape + sanitizing)
  controllers/           read matchedData(), call services, send JSON
  services/              business logic and Clover calls
    clover/client.ts     REST / Ecommerce / Hosted Checkout clients with retry
  middleware/            validate(), CORS, rate limit, brand, admin auth, errors
  data/menu-copy.ts      descriptions/photos by SKU, and the sandbox seed menu
```

Validators own the request **shape** (types, lengths, phone/email normalizing). Services own
**business rules** (item on the menu, required options, pickup slot open) and raise `AppError`.

## Endpoints

| Method | Path | |
| --- | --- | --- |
| GET | `/api/:brand/menu` | Menu from Clover inventory (cached 60s) |
| GET | `/api/:brand/info` | Open now, pickup slots, checkout mode |
| POST | `/api/:brand/quote` | Server-side prices + Clover tax |
| POST | `/api/:brand/orders` | Creates Clover customer + Hosted Checkout session |
| GET | `/api/orders/:ref` | Guest order status (reconciles payment if no webhook yet) |
| POST | `/api/webhooks/clover` | Hosted Checkout payment webhook (signed) |
| GET | `/api/admin/orders` | Bearer `ADMIN_TOKEN` |
| GET | `/api/admin/orders/:ref/clover` | Ecommerce API order view |
| POST | `/api/admin/orders/:ref/refund` | Ecommerce API refund |

## Order flow

1. The site sends the bag; the API reprices it from Clover inventory (client prices are never trusted).
2. A Clover customer is found or created; a Hosted Checkout session is opened with the lines and tax rates.
3. The guest pays on Clover's page. Clover creates the order and payment.
4. The webhook (or, in local dev, polling `/api/orders/:ref`) confirms the payment, then the API labels the
   Clover order for the kitchen: title `BC-XXXXXX · Name · pickup`, a note, the "Online Pickup" order type, and the customer.

## Before production

- Set `ITALIAN_SITE_URL` / `MEXICAN_SITE_URL` to the https sites: Clover only accepts https redirect URLs,
  so in local dev the guest comes back to the status page with the browser's Back button.
- Point each merchant's Hosted Checkout webhook at `https://<api>/api/webhooks/clover`
  (secrets are already set per brand).
- The Hosted Checkout private tokens currently return 401 from production; get working ones before
  setting `ORDERING_ENABLED=true`.
- Replace the JSON order ledger (`services/store.service.ts`) and the in-memory rate limiter with shared storage
  before running more than one instance.
- Live items have no description or photo yet: `data/menu-copy.ts` is keyed by SKU and only covers the sandbox seed.
