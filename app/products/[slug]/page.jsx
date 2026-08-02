/**
 * Product detail route (handoff README §Product detail).
 *
 * Server component: it resolves the slug at build time and pre-renders one
 * HTML file per product. Everything interactive (qty stepper, add-to-cart,
 * accordions) lives in the client child, so the copy above the fold is static
 * markup rather than something the browser has to assemble.
 */

import { notFound } from 'next/navigation';
import { bySlug, products } from '@/lib/products';
import ProductDetail from './ProductDetail';

/** One static route per catalog slug — required by `output: 'export'`. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Natural Glow Boutique`,
    description: product.description,
  };
}

/** Same category first, then the rest of the catalog; three cards. */
function relatedTo(product) {
  const others = products.filter((p) => p.id !== product.id);
  return [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, 3);
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) notFound();

  return <ProductDetail product={product} related={relatedTo(product)} />;
}
