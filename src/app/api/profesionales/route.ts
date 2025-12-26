import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Obtener todos los profesionales
export async function GET() {
  try {
    const { data: profesionales, error } = await supabase
      .from('profesionales')
      .select('id, nombre_completo, email, telefono, especialidad, comunas, experiencia, certificaciones, descripcion, foto_perfil, estado, valoracion, trabajos_realizados, plan, leads_usados, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener profesionales:', error);
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(profesionales || []);
  } catch (error) {
    console.error('Error al leer profesionales:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Registrar nuevo profesional
export async function POST(req: NextRequest) {
  try {
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
    const { data: nuevoProfesional, error } = await supabase
      .from('profesionales')
      .insert([{
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
        estado: 'pendiente',
        valoracion: 0,
        trabajos_realizados: 0,
        leads_usados: 0
      }])
      .select('id, nombre_completo, email, telefono, especialidad, plan, estado')
      .single();

    if (error) {
      console.error('Error al insertar profesional:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Error al registrar profesional' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      profesional: nuevoProfesional,
      mensaje: 'Profesional registrado exitosamente. Pronto recibirás un correo de confirmación.'
    });
  } catch (error) {
    console.error('Error al registrar profesional:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al registrar profesional' 
    }, { status: 500 });
  }
}
