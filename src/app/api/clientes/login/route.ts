import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyPassword } from '@/lib/auth';

const clientesPath = path.join(process.cwd(), 'data', 'clientes.json');

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Leer clientes
    const data = fs.readFileSync(clientesPath, 'utf-8');
    const clientes = JSON.parse(data);

    // Buscar cliente por email
    const cliente = clientes.find((c: any) => c.email === email);

    if (!cliente) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    let passwordValida = false;
    
    if (cliente.passwordHash) {
      // Sistema nuevo con hash
      passwordValida = await verifyPassword(password, cliente.passwordHash);
    } else if (cliente.password) {
      // Sistema antiguo con password plana (retrocompatibilidad)
      passwordValida = cliente.password === password;
    }

    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // No devolver hash ni password
    const { passwordHash, password: _, ...clienteSinPassword } = cliente;

    return NextResponse.json({
      success: true,
      mensaje: 'Inicio de sesión exitoso',
      cliente: clienteSinPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
