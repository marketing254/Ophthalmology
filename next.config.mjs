/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.obacademy.org' },
      { protocol: 'https', hostname: 'obacademy.org' },
    ],
  },
};

export default nextConfig;
