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
      .select('id, nombreCompleto, email, telefono, especialidad, comunas, experiencia, certificaciones, descripcion, fotoPerfil, estado, valoracion, trabajosRealizados, plan, leadsUsados, createdAt')
      .order('createdAt', { ascending: false });

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
        nombreCompleto: body.nombreCompleto,
        rut: body.rut,
        email: body.email,
        telefono: body.telefono,
        passwordHash,
        especialidad: body.especialidad,
        comunas: body.comunas || [],
        experiencia: body.experiencia || 0,
        certificaciones: body.certificaciones || '',
        descripcion: body.descripcion || '',
        plan: body.plan || 'starter',
        estado: 'pendiente',
        valoracion: 0,
        trabajosRealizados: 0,
        leadsUsados: 0
      }])
      .select('id, nombreCompleto, email, telefono, especialidad, plan, estado')
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
