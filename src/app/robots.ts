import { MetadataRoute } from 'next';

/**
 * Robots.txt para control de crawlers
 * Next.js lo genera automáticamente en /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/clientes/dashboard',
          '/clientes/editar-perfil',
          '/clientes/cotizaciones',
          '/profesionales/dashboard',
          '/profesionales/editar',
          '/profesionales/responder',
          '/test-webpay',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/clientes/dashboard',
          '/profesionales/dashboard',
        ],
      },
    ],
    sitemap: 'https://www.electricistaschile.com/sitemap.xml',
  };
}
