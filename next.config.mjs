/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode
  reactStrictMode: true,
  
  // Server external packages
  serverExternalPackages: ['@prisma/client'],
  
  // OpenClaw Netlify static export
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Images pour Netlify (désactivées pour statique)
  images: {
    unoptimized: true,
  },
  
  // Image optimization (désactivée pour export)
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'http',
  //       hostname: 'localhost',
  //       port: '3000',
  //     },
  //   ],
  //   formats: ['image/webp', 'image/avif'],
  // },
  
  // Turbopack désactivé pour stabilité
  turbopack: false,
  
  // Compression
  compress: true,
  
  // Performance
  poweredByHeader: false,
  
  // SWC minification
  swcMinify: true,
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // OpenClaw final webpack config
  webpack: (config, { isServer }) => {
    // Ignorer les problèmes de modules ES
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    // Résolution des modules plus permissive
    config.resolve.extensionAlias = {
      '.js': ['.js', '.jsx', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.js'],
      '.cjs': ['.cjs', '.js'],
    };
    
    // Désactiver les vérifications strictes pour ES modules
    config.module.rules.push({
      test: /\.(js|mjs|ts|tsx)$/,
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
}

export default nextConfig;