import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicit turbopack root to avoid workspace root inference warnings
  turbopack: {
    root: path.resolve(__dirname),
  } as any,
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Configuración para desarrollo móvil
  experimental: {
    // Aumentar timeout para conexiones móviles
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Headers para permitir acceso desde red local
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        ],
      },
    ];
  },
};

export default nextConfig;
