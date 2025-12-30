import './globals.css';
import type { Metadata, Viewport } from 'next';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import Footer from '@/components/ui/Footer';
import AdminDataInitializer from '@/components/admin/AdminDataInitializer';

export const metadata: Metadata = {
  title: 'ELIENAI SPA - Electricistas y Carpinteros Profesionales en Chile',
  description: 'Encuentra electricistas certificados y carpinteros profesionales en la V Región. Cotización gratis, servicios eléctricos, instalaciones solares, carpintería a medida. +500 profesionales verificados con 98% de satisfacción.',
  keywords: ['electricistas', 'carpinteros', 'V región', 'Valparaíso', 'servicios eléctricos', 'instalación solar', 'paneles solares', 'carpintería', 'construcción', 'certificación SEC', 'emergencias eléctricas'],
  authors: [{ name: 'ELIENAI SPA' }],
  creator: 'ELIENAI SPA',
  publisher: 'ELIENAI SPA',
  metadataBase: new URL('https://www.electricistaschile.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ELIENAI SPA - Electricistas y Carpinteros Profesionales',
    description: 'Conectamos clientes con los mejores profesionales de electricidad y carpintería en Chile. +500 profesionales verificados, cotización gratuita.',
    url: 'https://www.electricistaschile.com',
    siteName: 'ELIENAI SPA',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ELIENAI SPA - Servicios Profesionales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ELIENAI SPA - Electricistas y Carpinteros Profesionales',
    description: 'Encuentra profesionales certificados en electricidad y carpintería. Cotización gratuita.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Agregar cuando tengas Google Search Console configurado
    // google: 'tu-código-de-verificación',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ELIENAI SPA - Electricistas Chile",
    "image": "https://www.electricistaschile.com/og-image.jpg",
    "description": "Plataforma líder de electricistas y carpinteros certificados en Chile. Más de 500 profesionales verificados.",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Valparaíso",
      "addressCountry": "CL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-33.0472",
      "longitude": "-71.6127"
    },
    "url": "https://www.electricistaschile.com",
    "telephone": "+56-9-XXXX-XXXX",
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500"
    },
    "sameAs": [
      "https://www.facebook.com/electricistaschile",
      "https://www.instagram.com/electricistaschile"
    ]
  };

  return (
    <html lang="es-CL">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="m-0 p-0 antialiased">
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
        
        {/* Inicializador de datos del admin */}
        <AdminDataInitializer />
        
        {children}
        <Footer />
      </body>
    </html>
  )
}