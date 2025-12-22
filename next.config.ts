import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicit turbopack root to avoid workspace root inference warnings
  turbopack: {
    root: path.resolve(__dirname),
  } as any,
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
