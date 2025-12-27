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
const ADMIN_PASSWORD = 'ALEJO#1972fer#21';

const ADMIN_ACCOUNTS = [
  {
    email: 'yfuelaluz@gmail.com',
    telefono: '+56995748162',
    nombre_completo: 'Alejandro Fernández',
    rut: '12345678-9',
  },
  {
    email: 'yfuelaluz@hotmail.com',
    telefono: '+56995748162',
    nombre_completo: 'Alejandro Fernández',
    rut: '12345678-9',
  }
];

// Inicializar/actualizar profesional admin
async function ensureAdminProfesional(supabase: any, adminData: any, passwordHash: string) {
  const profesionalData = {
    nombre_completo: adminData.nombre_completo,
    rut: adminData.rut,
    email: adminData.email,
    telefono: adminData.telefono,
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
    .eq('email', adminData.email)
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
async function ensureAdminCliente(supabase: any, adminData: any, passwordHash: string) {
  const clienteData = {
    nombre_completo: adminData.nombre_completo,
    rut: adminData.rut,
    email: adminData.email,
    telefono: adminData.telefono,
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
    .eq('email', adminData.email)
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
    
    // Hash de la contraseña (misma para ambas cuentas)
    const passwordHash = await hashPassword(ADMIN_PASSWORD);

    const results = [];

    // Crear/actualizar ambas cuentas de administrador
    for (const adminData of ADMIN_ACCOUNTS) {
      const [profesional, cliente] = await Promise.all([
        ensureAdminProfesional(supabase, adminData, passwordHash),
        ensureAdminCliente(supabase, adminData, passwordHash)
      ]);

      results.push({
        email: adminData.email,
        profesional,
        cliente
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Datos de administradores inicializados correctamente',
      data: results
    });

  } catch (error: any) {
    console.error('Error al inicializar admin:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
