import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyPassword } from '@/lib/auth';

const profesionalesPath = path.join(process.cwd(), 'data', 'profesionales.json');

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Leer profesionales
    const data = fs.readFileSync(profesionalesPath, 'utf-8');
    const profesionales = JSON.parse(data);

    // Buscar profesional por email
    const profesional = profesionales.find((p: any) => p.email === email);

    if (!profesional) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    let passwordValida = false;
    
    if (profesional.passwordHash) {
      // Sistema nuevo con hash
      passwordValida = await verifyPassword(password, profesional.passwordHash);
    } else if (profesional.password) {
      // Sistema antiguo con password plana (retrocompatibilidad)
      passwordValida = profesional.password === password;
    }

    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // No devolver hash ni password
    const { passwordHash, password: _, ...profesionalSinPassword } = profesional;

    return NextResponse.json({
      success: true,
      mensaje: 'Inicio de sesión exitoso',
      profesional: profesionalSinPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
