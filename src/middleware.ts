import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Credenciales de administrador (en producción deberían estar en variables de entorno)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ElienaiAdmin2025!';

// Función para decodificar base64 compatible con Edge Runtime
function base64Decode(str: string): string {
  try {
    return atob(str);
  } catch {
    return '';
  }
}

export function middleware(request: NextRequest) {
  // Solo proteger rutas /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Verificar si hay autenticación básica
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return new NextResponse('Autenticación requerida', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Panel de Administración"',
        },
      });
    }

    // Decodificar credenciales
    const auth = authHeader.split(' ')[1];
    if (!auth) {
      return new NextResponse('Autenticación requerida', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Panel de Administración"',
        },
      });
    }

    const credentials = base64Decode(auth);
    const [username, password] = credentials.split(':');

    // Verificar credenciales
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return new NextResponse('Credenciales inválidas', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Panel de Administración"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
