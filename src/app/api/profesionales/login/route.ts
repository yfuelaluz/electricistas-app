import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyPassword } from '@/lib/auth';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// Función para convertir snake_case a camelCase (para enviar al frontend)
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const camelKey = key.replace(/_(\w)/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar profesional por email
    const { data: profesional, error } = await supabase
      .from('profesionales')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !profesional) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordValida = await verifyPassword(password, profesional.password_hash);

    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // No devolver hash ni password
    const { password_hash, password: _, ...profesionalSinPassword } = profesional;

    // Convertir snake_case a camelCase antes de enviar al frontend
    const profesionalTransformado = toCamelCase(profesionalSinPassword);
    
    return NextResponse.json({
      success: true,
      mensaje: 'Inicio de sesión exitoso',
      profesional: profesionalTransformado
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
