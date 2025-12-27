"use client";

import Script from 'next/script';

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string;
}

/**
 * Componente para Google Analytics 4
 * 
 * Uso:
 * 1. Crea una propiedad GA4 en https://analytics.google.com
 * 2. Obtén tu Measurement ID (formato: G-XXXXXXXXXX)
 * 3. Agrégalo a .env.local: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 4. Este componente se carga automáticamente en layout.tsx
 */
export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  // Solo cargar en producción
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Hook para enviar eventos personalizados a GA4
 * 
 * Ejemplos de uso:
 * 
 * import { trackEvent } from '@/components/analytics/GoogleAnalytics';
 * 
 * // Tracking de cotización
 * trackEvent('cotizacion_enviada', {
 *   category: 'engagement',
 *   label: 'electricidad',
 *   value: 210000
 * });
 * 
 * // Tracking de registro
 * trackEvent('registro_profesional', {
 *   category: 'conversions',
 *   plan: 'starter'
 * });
 */
export const trackEvent = (
  action: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, params);
  }
};

/**
 * Tracking de páginas (útil para SPAs)
 */
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
