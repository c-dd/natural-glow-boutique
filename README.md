# Natural Glow Boutique

The skincare side of Natural Glow — lives at https://naturalglowboutique.com
(Netlify site `natural-glow-demo`, team CCD; the netlify.app name is legacy).

Next.js 15 (App Router) shipped as a **static export**. No server, no API
routes, no Netlify functions — `next build` writes a plain HTML/CSS/JS site to
`out/`, and that folder is what gets deployed.

Design source of truth: `../design_handoff_naturalglow_nextjs/` — `README.md`
(spec), `Natural Glow Site.dc.html` (the clickable prototype; pixel + copy
reference), `products.json` (catalog), `assets/*.png` (product photography,
copied into `public/products/`).

## Build & deploy

```bash
npm install
npm run dev          # local dev at http://localhost:3000
npm run build        # static export -> ./out
netlify deploy --prod --dir out
```

## Layout

```
app/
  layout.jsx      root layout: fonts, metadata, CartProvider > ToastProvider > SiteChrome
  globals.css     design tokens (colors, hairlines, type scale, spacing) + resets
  page.jsx        Home
  terms/          Terms of Service
  privacy/        Privacy Policy
components/
  SiteChrome.jsx      chrome wrapper + minimal-chrome route registry
  AnnouncementBar.jsx / Header.jsx / Footer.jsx
  Toast.jsx           add-to-cart toast + useToast() / useAddToCart()
  Legal.jsx           legal page frame and type primitives
lib/
  products.js     catalog + lookups + price formatting
  cart.jsx        cart context, persisted to localStorage
public/products/  product photography
```

## Conventions

- **Styling**: plain React inline styles that read design tokens
  (`var(--ng-…)`) from `app/globals.css`. Hover states can't be expressed
  inline, so the few that exist are utility classes in the same file:
  `.ng-btn`, `.ng-btn-outline`, `.ng-link-underline`, `.ng-hover`.
  Everything is square-cornered; the only shadow in the system is the toast.
- **Imports** use the `@/*` alias (see `jsconfig.json`).
- **No `useSearchParams`** — it forces a client bailout under `output: 'export'`.
  Read query strings from `window.location.search` inside an effect instead.
  (`usePathname` is fine and is what `SiteChrome` uses.)
- `trailingSlash: true`, so `next/link` emits `/shop/`, `/terms/`, etc.

## Catalog

`lib/products.js` holds the handoff catalog verbatim (image paths rewritten to
`/products/*.png`) plus two derived fields, `catLabel` (breadcrumb) and
`cardSub` (the Home bestseller sub line).

```js
import { products, bestsellers, bySlug, byId, byCategory,
         categories, shopFilters, categoryTitle,
         formatPrice, formatPriceWhole } from '@/lib/products';
```

`formatPrice(72)` → `$72.00` (cart, checkout, toasts).
`formatPriceWhole(72)` → `$72` (product cards).

## Cart

`lib/cart.jsx` — context + `localStorage` key `ngb-cart-v1`, shape
`[{ id, qty }]`. Written on every change, restored on mount.

```js
const { items, lines, count, subtotal, hydrated, add, setQty, remove, clear } = useCart();
```

`lines` joins cart rows to catalog data (`{ ...product, qty, line }`). The
provider renders empty on the server and hydrates in an effect, so `count` is
`0` for one frame on first paint — `hydrated` tells you when the restore has
run. Unknown ids and bad quantities in storage are discarded on read.
`setQty(id, 0)` removes the row, which is what the cart's "−" at qty 1 wants.

## Add-to-cart toast

```js
const addToCart = useAddToCart();   // adds AND toasts — the normal path
addToCart(product, qty);

const { fireToast, dismiss } = useToast();   // toast on its own
```

Fires top-right, auto-dismisses after 3.2s; consecutive adds replace the
contents and reset the timer rather than stacking.

## Chrome opt-out (`/checkouts`)

`components/SiteChrome.jsx` renders full chrome (announcement bar + nav +
cart + footer) by default and **minimal** chrome (centered logo +
"SECURE CHECKOUT", no announcement bar / nav / cart, footer unchanged) for any
path listed in `MINIMAL_CHROME_ROUTES`. `/checkouts` is already registered, so
that page needs no extra wiring — add further paths to that array if another
route ever needs the same treatment. Matching covers nested paths.

## Payments

Deliberately **not** wired. The legal copy's payment-processor sentences are
neutral placeholders marked with a `PAYMENT PROCESSOR — update when gateway
chosen` comment in `app/terms/page.jsx` and `app/privacy/page.jsx`; revisit
them (and this section) once a gateway is selected.

## Related

- The research-supply store: https://naturalglowresearchsupply.com —
  repo `c-dd/natural-glow-1`, folder `natural-glow-main`
- The old "Direction 2" demo code this site previously served:
  repo `c-dd/natural-glow-2` (kept as design archive)
