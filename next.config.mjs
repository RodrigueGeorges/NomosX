/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/instrumentation',
    '@sentry/nextjs',
    '@sentry/node',
    '@opentelemetry/instrumentation',
    'require-in-the-middle',
    'import-in-the-middle',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;