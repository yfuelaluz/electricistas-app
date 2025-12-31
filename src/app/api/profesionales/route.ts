import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '@/lib/auth';

// Helper para obtener cliente Supabase
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
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

// GET - Obtener todos los profesionales
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data: profesionales, error } = await supabase
      .from('profesionales')
      .select('id, nombre_completo, email, telefono, especialidad, comunas, experiencia, certificaciones, descripcion, foto_perfil, estado, valoracion, trabajos_realizados, plan, leads_usados, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener profesionales:', error);
      return NextResponse.json([], { status: 200 });
    }
    
    // Convertir snake_case a camelCase antes de enviar al frontend
    const profesionalesTransformados = toCamelCase(profesionales || []);
    return NextResponse.json(profesionalesTransformados);
  } catch (error) {
    console.error('Error al leer profesionales:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Registrar nuevo profesional
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await req.json();
    
    // Verificar si el email ya existe
    const { data: existente } = await supabase
      .from('profesionales')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existente) {
      return NextResponse.json({ 
        success: false, 
        error: 'El email ya está registrado' 
      }, { status: 400 });
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(body.password);

    // Crear nuevo profesional
    const datosInsertar = {
      nombre_completo: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      telefono: body.telefono,
      password_hash: passwordHash,
      especialidad: body.especialidad,
      comunas: body.comunas || [],
      experiencia: body.experiencia || 0,
      certificaciones: body.certificaciones || '',
      descripcion: body.descripcion || '',
      foto_perfil: body.fotoPerfil || '',
      plan: body.plan || 'starter',
      estado: 'Activo',
      valoracion: 0,
      trabajos_realizados: 0,
      leads_usados: 0
    };

    const { data: nuevoProfesional, error } = await supabase
      .from('profesionales')
      .insert([datosInsertar])
      .select('id, nombre_completo, email, telefono, especialidad, plan, estado')
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        success: false, 
        error: `Error al registrar: ${error.message}` 
      }, { status: 500 });
    }

    // Convertir snake_case a camelCase antes de enviar al frontend
    const profesionalTransformado = toCamelCase(nuevoProfesional);
    
    // Enviar notificación al admin
    try {
      const { enviarEmail, emailTemplates } = await import('@/lib/email');
      const adminEmail = process.env.ADMIN_EMAIL || 'yfuelaluz@gmail.com';
      const template = emailTemplates.nuevoProfesionalRegistrado(
        nuevoProfesional.nombre_completo,
        nuevoProfesional.email,
        nuevoProfesional.especialidad,
        nuevoProfesional.telefono
      );
      await enviarEmail({
        to: adminEmail,
        subject: template.subject,
        html: template.html
      });
    } catch (emailError) {
      console.error('Error enviando notificación al admin:', emailError);
      // No fallar el registro si el email falla
    }
    
    return NextResponse.json({ 
      success: true, 
      profesional: profesionalTransformado,
      mensaje: 'Profesional registrado exitosamente. Ya puedes empezar a recibir cotizaciones.'
    });
  } catch (error) {
    console.error('Error al registrar profesional:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al registrar profesional' 
    }, { status: 500 });
  }
}
