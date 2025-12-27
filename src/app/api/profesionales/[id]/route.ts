import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '@/lib/auth';

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();

    // Preparar datos para actualizar
    const datosActualizar: any = {
      nombre_completo: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      telefono: body.telefono,
      especialidad: body.especialidad,
      comunas: body.comunas,
      experiencia: body.experiencia,
      certificaciones: body.certificaciones,
      descripcion: body.descripcion,
      foto_perfil: body.fotoPerfil,
    };

    // Si se envía nueva contraseña, hashearla
    if (body.password) {
      datosActualizar.password_hash = await hashPassword(body.password);
    }

    // Actualizar profesional
    const { data: profesional, error } = await supabase
      .from('profesionales')
      .update(datosActualizar)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar profesional:', error);
      return NextResponse.json(
        { error: 'Error al actualizar profesional' },
        { status: 500 }
      );
    }

    if (!profesional) {
      return NextResponse.json(
        { error: 'Profesional no encontrado' },
        { status: 404 }
      );
    }

    // Convertir snake_case a camelCase antes de enviar al frontend
    const profesionalTransformado = toCamelCase(profesional);
    
    return NextResponse.json({
      success: true,
      profesional: profesionalTransformado
    });

  } catch (error) {
    console.error('Error al actualizar profesional:', error);
    return NextResponse.json(
      { error: 'Error al actualizar profesional' },
      { status: 500 }
    );
  }
}
