/**
 * Natural Glow Boutique catalog.
 *
 * Data is inlined verbatim from the handoff's `products.json` — every field is
 * carried over unchanged (id, slug, name, tagline, category, size, price,
 * supplement, description, actives, ingredients, howToUse). The only edit is
 * `image`, rewritten from the handoff's `assets/*.png` to the deployed public
 * path `/products/*.png` (files copied into public/products/).
 *
 * Two derived fields are added for convenience — both lifted from the
 * prototype so nothing has to be re-invented downstream:
 *   `catLabel`  — uppercase breadcrumb label ("SHOP / FACE")
 *   `cardSub`   — the bespoke Home-bestsellers sub line, where the prototype
 *                 hard-codes one (see `bestsellers` below). Shop cards use the
 *                 generic `${tagline} · ${size}` form instead.
 */

export const catalog = {
  currency: 'USD',
  freeShippingNote:
    'Complimentary standard shipping on every order; express +$15.00',
  contact: 'hello@naturalglowboutique.com',
};

/** Express shipping surcharge, USD (standard is complimentary). */
export const EXPRESS_SHIPPING = 15;

/** Category metadata: shop page titles, filter-tab labels, breadcrumb labels. */
export const categories = [
  { value: 'face', title: 'Face', filterLabel: 'FACE', catLabel: 'FACE' },
  { value: 'body', title: 'Body', filterLabel: 'BODY', catLabel: 'BODY' },
  {
    value: 'wellness',
    title: 'Wellness',
    filterLabel: 'WELLNESS',
    catLabel: 'WELLNESS',
  },
  {
    value: 'home',
    title: 'Home Fragrance',
    filterLabel: 'HOME',
    catLabel: 'HOME FRAGRANCE',
  },
];

/** Shop filter tabs, in prototype order — ALL first, then the categories. */
export const shopFilters = [
  { value: 'all', title: 'Shop All', filterLabel: 'ALL', catLabel: 'SHOP ALL' },
  ...categories,
];

const catLabelFor = (category) =>
  categories.find((c) => c.value === category)?.catLabel ?? 'SHOP';

/** Sub lines the prototype hard-codes on the Home "Bestsellers" cards. */
const CARD_SUBS = {
  serum: 'Hyaluronic acid + vitamin C · 30 ml',
  oil: 'Nourish + glow · 30 ml',
  scrub: 'Smooth + renew · 8 oz',
  candle: 'Lavender + chamomile · 8 oz',
};

const RAW = [
  {
    id: 'serum',
    slug: 'glow-face-serum',
    name: 'Glow Face Serum',
    tagline: 'Hydrate + Renew',
    category: 'face',
    size: '1 fl oz | 30 ml',
    price: 72,
    image: '/products/glow-face-serum.png',
    supplement: false,
    description:
      'A featherweight daily serum that floods skin with moisture. Hyaluronic acid draws water deep into the skin while stabilised vitamin C brightens and evens tone — a dewy, lit-from-within finish with no residue.',
    actives: 'Hyaluronic acid · Vitamin C · Aloe · Rose water',
    ingredients:
      'Aqua, sodium hyaluronate (hyaluronic acid), sodium ascorbyl phosphate (vitamin C), plant-derived glycerin, aloe barbadensis leaf juice, rosa damascena flower water, radish root ferment filtrate.',
    howToUse:
      'Morning and evening, press 3–4 drops onto clean, damp skin before moisturising. Follow with SPF in the morning.',
  },
  {
    id: 'oil',
    slug: 'radiance-facial-oil',
    name: 'Radiance Facial Oil',
    tagline: 'Nourish + Glow',
    category: 'face',
    size: '1 fl oz | 30 ml',
    price: 78,
    image: '/products/radiance-facial-oil.png',
    supplement: false,
    description:
      'Cold-pressed botanical oils in amber glass. Rosehip and jojoba absorb quickly to soften the look of fine lines and restore a healthy, luminous glow — never a greasy finish.',
    actives: 'Rosehip · Jojoba · Marula · Vitamin E',
    ingredients:
      'Rosa canina (rosehip) seed oil*, simmondsia chinensis (jojoba) seed oil*, sclerocarya birrea (marula) seed oil, tocopherol (vitamin E), calendula officinalis flower extract. *Cold-pressed.',
    howToUse:
      'As the last step of your evening ritual, warm 4–6 drops between your palms and press gently into face and neck.',
  },
  {
    id: 'scrub',
    slug: 'exfoliating-sugar-scrub',
    name: 'Exfoliating Sugar Scrub',
    tagline: 'Smooth + Renew',
    category: 'body',
    size: '8 oz | 226 g',
    price: 70,
    image: '/products/exfoliating-sugar-scrub.png',
    supplement: false,
    description:
      'Fine pink sugar crystals whipped with shea butter and sweet almond oil. Buffs away dullness and leaves skin petal-soft, with a delicate scent of rose and vanilla.',
    actives: 'Cane sugar · Shea butter · Sweet almond oil',
    ingredients:
      'Sucrose (cane sugar), butyrospermum parkii (shea) butter, prunus amygdalus dulcis (sweet almond) oil, rosa damascena flower extract, vanilla planifolia fruit extract, tocopherol.',
    howToUse:
      'In the shower, massage a small handful over damp skin in circular motions, 2–3 times weekly. Rinse well. Take care — the tub may be slippery after use.',
  },
  {
    id: 'candle',
    slug: 'calm-unwind-candle',
    name: 'Calm + Unwind Candle',
    tagline: 'Lavender + Chamomile',
    category: 'home',
    size: '8 oz | 226 g',
    price: 74,
    image: '/products/calm-unwind-candle.png',
    supplement: false,
    description:
      "A natural soy candle poured by hand into amber glass. French lavender and Roman chamomile settle the room — and the mind — for slow evenings. Approximately 45 hours of burn time.",
    actives: 'Natural soy wax · Lavender · Chamomile · Cotton wick',
    ingredients:
      '100% natural soy wax, pure lavender and chamomile essential oils, lead-free cotton wick.',
    howToUse:
      "Trim the wick to ¼ inch before each burn. On first light, let the wax pool reach the jar's edge. Never burn longer than 4 hours or leave unattended.",
  },
  {
    id: 'ww',
    slug: 'womens-wellness',
    name: "Women's Wellness",
    tagline: 'Daily Support',
    category: 'wellness',
    size: '60 capsules',
    price: 76,
    image: '/products/womens-wellness.png',
    supplement: true,
    description:
      'A once-daily blend formulated for women — essential vitamins and gentle botanicals to support energy, balance, and everyday vitality.†',
    actives: 'B-complex · Iron · Ashwagandha · Zinc',
    ingredients:
      'Vitamin B6, vitamin B12, folate, iron, zinc, magnesium, ashwagandha root extract, vegetable cellulose capsule. Free from gluten, dairy, and soy.',
    howToUse:
      'Take one capsule daily with food, or as directed by your healthcare practitioner.',
  },
  {
    id: 'hsn',
    slug: 'hair-skin-nails',
    name: 'Hair, Skin + Nails',
    tagline: 'Nourish + Strengthen',
    category: 'wellness',
    size: '60 capsules',
    price: 82,
    image: '/products/hair-skin-nails.png',
    supplement: true,
    description:
      'Biotin, collagen, and vitamin E in one daily capsule — targeted support for stronger nails, fuller-looking hair, and supple skin.†',
    actives: 'Biotin · Collagen · Vitamin E',
    ingredients:
      'Biotin, hydrolyzed collagen peptides, tocopherol (vitamin E), vitamin C, silica, vegetable cellulose capsule.',
    howToUse:
      'Take one capsule daily with food. Best results come with consistent use over 8–12 weeks.',
  },
];

/** The full catalog, in prototype order. */
export const products = RAW.map((p) => ({
  ...p,
  catLabel: catLabelFor(p.category),
  cardSub: CARD_SUBS[p.id] ?? `${p.tagline} · ${p.size}`,
}));

/** Home "Bestsellers" row — the four products the prototype features, in order. */
export const bestsellers = ['serum', 'oil', 'scrub', 'candle'].map((id) =>
  products.find((p) => p.id === id)
);

/** Lookup by URL slug (`/products/[slug]`). */
export function bySlug(slug) {
  return products.find((p) => p.slug === slug);
}

/** Lookup by cart id (the short ids stored in `ngb-cart-v1`). */
export function byId(id) {
  return products.find((p) => p.id === id);
}

/** Products in a category; `undefined` / `'all'` returns everything. */
export function byCategory(category) {
  if (!category || category === 'all') return products;
  return products.filter((p) => p.category === category);
}

/** Shop page title for a filter value ("Shop All" / "Face" / …). */
export function categoryTitle(value) {
  return shopFilters.find((c) => c.value === value)?.title ?? 'Shop All';
}

/** Money for cart / checkout / toasts — always two decimals: `$72.00`. */
export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

/** Money for product cards — whole dollars, no decimals: `$72`. */
export function formatPriceWhole(value) {
  return `$${Number(value)}`;
}
