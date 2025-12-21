import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electricistas Profesionales',
  description: 'Servicios de ingeniería y construcción eléctrica en la V Región de Valparaíso',
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