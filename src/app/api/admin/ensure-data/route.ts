import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '@/lib/auth';

// Helper para obtener cliente Supabase
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// Datos del administrador
const ADMIN_DATA = {
  email: 'yfuelaluz@gmail.com',
  telefono: '+56995748162',
  nombre_completo: 'Alejandro Fernández',
  rut: '12345678-9',
  password: 'ALEJO#1972fer#21', // Tu contraseña
};

// Inicializar/actualizar profesional admin
async function ensureAdminProfesional(supabase: any, passwordHash: string) {
  const profesionalData = {
    nombre_completo: ADMIN_DATA.nombre_completo,
    rut: ADMIN_DATA.rut,
    email: ADMIN_DATA.email,
    telefono: ADMIN_DATA.telefono,
    password_hash: passwordHash,
    especialidad: 'Electricidad Integral',
    comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
    experiencia: 15,
    certificaciones: 'Certificado SEC Clase A, Instalador Autorizado Paneles Solares, Electricista Industrial',
    descripcion: 'Administrador y fundador de ELIENAI SPA. Especialista en instalaciones eléctricas, sistemas solares y proyectos industriales.',
    foto_perfil: '/images/admin-profile.jpg',
    plan: 'elite',
    estado: 'activo',
    valoracion: 5.0,
    trabajos_realizados: 0,
    leads_usados: 0,
    rol: 'admin'
  };

  // Verificar si existe
  const { data: existing } = await supabase
    .from('profesionales')
    .select('id')
    .eq('email', ADMIN_DATA.email)
    .single();

  if (existing) {
    // Actualizar
    const { error } = await supabase
      .from('profesionales')
      .update(profesionalData)
      .eq('id', existing.id);
    
    if (error) throw error;
    return { id: existing.id, action: 'updated' };
  } else {
    // Crear
    const { data, error } = await supabase
      .from('profesionales')
      .insert([profesionalData])
      .select('id')
      .single();
    
    if (error) throw error;
    return { id: data.id, action: 'created' };
  }
}

// Inicializar/actualizar cliente admin
async function ensureAdminCliente(supabase: any, passwordHash: string) {
  const clienteData = {
    nombre_completo: ADMIN_DATA.nombre_completo,
    rut: ADMIN_DATA.rut,
    email: ADMIN_DATA.email,
    telefono: ADMIN_DATA.telefono,
    direccion: 'Valparaíso, V Región',
    comuna: 'Valparaíso',
    password_hash: passwordHash,
    plan: 'empresa',
    estado: 'activo',
    rol: 'admin'
  };

  // Verificar si existe
  const { data: existing } = await supabase
    .from('clientes')
    .select('id')
    .eq('email', ADMIN_DATA.email)
    .single();

  if (existing) {
    // Actualizar
    const { error } = await supabase
      .from('clientes')
      .update(clienteData)
      .eq('id', existing.id);
    
    if (error) throw error;
    return { id: existing.id, action: 'updated' };
  } else {
    // Crear
    const { data, error } = await supabase
      .from('clientes')
      .insert([clienteData])
      .select('id')
      .single();
    
    if (error) throw error;
    return { id: data.id, action: 'created' };
  }
}

// POST - Inicializar/actualizar datos del admin
export async function POST() {
  try {
    const supabase = getSupabaseClient();
    
    // Hash de la contraseña
    const passwordHash = await hashPassword(ADMIN_DATA.password);

    // Asegurar que existen ambos registros
    const [profesional, cliente] = await Promise.all([
      ensureAdminProfesional(supabase, passwordHash),
      ensureAdminCliente(supabase, passwordHash)
    ]);

    return NextResponse.json({
      success: true,
      message: 'Datos del administrador inicializados correctamente',
      data: {
        profesional,
        cliente
      }
    });

  } catch (error: any) {
    console.error('Error al inicializar admin:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Verificar estado de los datos del admin
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Verificar existencia
    const [profesional, cliente] = await Promise.all([
      supabase
        .from('profesionales')
        .select('id, nombre_completo, email, plan, estado, rol')
        .eq('email', ADMIN_DATA.email)
        .single(),
      supabase
        .from('clientes')
        .select('id, nombre_completo, email, plan, estado, rol')
        .eq('email', ADMIN_DATA.email)
        .single()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        profesional: profesional.data || null,
        cliente: cliente.data || null,
        isComplete: !!(profesional.data && cliente.data)
      }
    });

  } catch (error: any) {
    console.error('Error al verificar admin:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
