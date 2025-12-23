import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Electricistas Profesionales',
  description: 'Servicios de ingeniería y construcción eléctrica en la V Región de Valparaíso',
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
  return (
    <html lang="es-CL">
      <body className="m-0 p-0 antialiased">
        {children}
      </body>
    </html>
  )
}