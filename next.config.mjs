/**
 * Static export configuration.
 * - `output: 'export'` writes a fully static site to /out — applied only for
 *   `next build`. In dev it is omitted, because Next 14's dev server rejects
 *   dynamic routes (episode [slug] pages, the generated sitemap route) under
 *   the export flag even when generateStaticParams is present.
 * - NEXT_PUBLIC_BASE_PATH is set by the GitHub Pages deploy workflow to
 *   "/<repo-name>". On Vercel and locally it is unset (site served from root).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isDev ? {} : { output: 'export' }),
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
