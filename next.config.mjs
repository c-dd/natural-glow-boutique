/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static storefront — no server, no API routes, no functions.
  // `next build` emits ./out, which is what gets deployed to Netlify.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
