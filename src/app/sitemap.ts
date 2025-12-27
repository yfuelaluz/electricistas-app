import { MetadataRoute } from 'next';

/**
 * Sitemap dinámico para SEO
 * Next.js lo genera automáticamente en /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.electricistaschile.com';
  const currentDate = new Date();

  return [
    // Página principal
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Búsqueda de profesionales
    {
      url: `${baseUrl}/buscar`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Cotizaciones
    {
      url: `${baseUrl}/cotizacion`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Servicios
    {
      url: `${baseUrl}/servicios`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/electricidad`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/carpinteria`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Planes y suscripciones
    {
      url: `${baseUrl}/suscripciones`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Login de clientes
    {
      url: `${baseUrl}/clientes/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/clientes/registro`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Login de profesionales
    {
      url: `${baseUrl}/profesionales/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profesionales/registro`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Páginas legales
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date('2024-12-27'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date('2024-12-27'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
