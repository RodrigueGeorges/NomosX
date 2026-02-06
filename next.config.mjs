/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;