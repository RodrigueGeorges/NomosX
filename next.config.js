/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Server external packages (moved from experimental)
  serverExternalPackages: ['@prisma/client'],
  
  // Image optimization with remote patterns
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Turbopack configuration
  turbopack: {},
  
  // Compression
  compress: true,
  
  // Performance budget
  poweredByHeader: false,
}

export default nextConfig