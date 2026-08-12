/**
 * Static export configuration (GitHub Pages).
 * - `output: 'export'` writes a fully static site to /out.
 * - NEXT_PUBLIC_BASE_PATH is set by the deploy workflow to "/<repo-name>"
 *   so the site works at https://<user>.github.io/<repo-name>/.
 *   Locally it is unset, so dev/preview run at the root as usual.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
