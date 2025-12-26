/**
 * Script de migración de datos JSON a Supabase
 * 
 * Ejecutar con: npm run migrate-to-supabase
 * 
 * Este script:
 * 1. Lee los archivos JSON actuales (data/*.json)
 * 2. Los inserta en las tablas de Supabase
 * 3. Mantiene los IDs originales donde sea posible
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const DATA_DIR = path.join(process.cwd(), 'data');

// Crear cliente de Supabase directamente aquí
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrarProfesionales() {
  console.log('\n📋 Migrando profesionales...');
  
  try {
    const data = await fs.readFile(path.join(DATA_DIR, 'profesionales.json'), 'utf-8');
    const profesionales = JSON.parse(data);

    for (const prof of profesionales) {
      const { error } = await supabase
        .from('profesionales')
        .upsert({
          id: prof.id,
          nombre_completo: prof.nombreCompleto,
          email: prof.email,
          password_hash: prof.passwordHash || prof.password || '',
          telefono: prof.telefono,
          especialidad: prof.especialidad,
          experiencia: prof.experiencia || 0,
          descripcion: prof.descripcion,
          ubicacion: prof.ubicacion,
          plan: prof.plan || 'starter',
          activo: prof.estado === 'activo',
          valoracion: prof.valoracion || 0,
          trabajos_realizados: prof.trabajosRealizados || 0,
          certificaciones: prof.certificaciones || [],
          tarifa_minima: prof.tarifa?.minima,
          tarifa_maxima: prof.tarifa?.maxima,
        }, { onConflict: 'email' });

      if (error) {
        console.error(`❌ Error al migrar profesional ${prof.email}:`, error.message);
      } else {
        console.log(`✅ Profesional migrado: ${prof.email}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error al migrar profesionales:', error.message);
  }
}

async function migrarClientes() {
  console.log('\n📋 Migrando clientes...');
  
  try {
    const data = await fs.readFile(path.join(DATA_DIR, 'clientes.json'), 'utf-8');
    const clientes = JSON.parse(data);

    for (const cliente of clientes) {
      const { error } = await supabase
        .from('clientes')
        .upsert({
          id: cliente.id,
          nombre: cliente.nombre,
          email: cliente.email,
          password_hash: cliente.passwordHash || cliente.password || '',
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          comuna: cliente.comuna,
          plan: cliente.plan || 'cliente-basico',
          activo: true,
        }, { onConflict: 'email' });

      if (error) {
        console.error(`❌ Error al migrar cliente ${cliente.email}:`, error.message);
      } else {
        console.log(`✅ Cliente migrado: ${cliente.email}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error al migrar clientes:', error.message);
  }
}

async function migrarCotizaciones() {
  console.log('\n📋 Migrando cotizaciones...');
  
  try {
    const data = await fs.readFile(path.join(DATA_DIR, 'cotizaciones.json'), 'utf-8');
    const cotizaciones = JSON.parse(data);

    for (const cot of cotizaciones) {
      const { error } = await supabase
        .from('cotizaciones')
        .upsert({
          id: cot.id,
          fecha: cot.fecha,
          cliente_data: cot.cliente,
          servicio: cot.servicio,
          presupuesto: cot.presupuesto || {},
          estado: cot.estado || 'pendiente',
          respuestas: cot.respuestas || [],
        }, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error al migrar cotización ${cot.id}:`, error.message);
      } else {
        console.log(`✅ Cotización migrada: ${cot.id}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error al migrar cotizaciones:', error.message);
  }
}

async function migrarReviews() {
  console.log('\n📋 Migrando reviews...');
  
  try {
    const data = await fs.readFile(path.join(DATA_DIR, 'reviews.json'), 'utf-8');
    const reviews = JSON.parse(data);

    for (const review of reviews) {
      const { error } = await supabase
        .from('reviews')
        .upsert({
          id: review.id,
          profesional_id: review.profesionalId,
          cliente_id: review.clienteId,
          cotizacion_id: review.cotizacionId,
          valoracion: review.valoracion,
          comentario: review.comentario,
          fecha: review.fecha,
        }, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error al migrar review ${review.id}:`, error.message);
      } else {
        console.log(`✅ Review migrado: ${review.id}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error al migrar reviews:', error.message);
  }
}

async function migrarPortfolio() {
  console.log('\n📋 Migrando portfolio...');
  
  try {
    const data = await fs.readFile(path.join(DATA_DIR, 'portfolio.json'), 'utf-8');
    const trabajos = JSON.parse(data);

    for (const trabajo of trabajos) {
      const { error } = await supabase
        .from('portfolio')
        .upsert({
          id: trabajo.id,
          profesional_id: trabajo.profesionalId,
          titulo: trabajo.titulo,
          descripcion: trabajo.descripcion,
          categoria: trabajo.categoria,
          imagenes: trabajo.imagenes || [],
          ubicacion: trabajo.ubicacion,
          duracion: trabajo.duracion,
          destacado: trabajo.destacado || false,
          fecha: trabajo.fecha,
        }, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error al migrar trabajo ${trabajo.id}:`, error.message);
      } else {
        console.log(`✅ Trabajo migrado: ${trabajo.id}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error al migrar portfolio:', error.message);
  }
}

async function ejecutarMigracion() {
  console.log('🚀 Iniciando migración a Supabase...\n');
  console.log('⚠️  Asegúrate de haber configurado NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local\n');

  // Verificar configuración
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ ERROR: Variables de Supabase no configuradas en .env.local');
    console.log('\nAgrega estas líneas a tu archivo .env.local:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui');
    process.exit(1);
  }

  await migrarProfesionales();
  await migrarClientes();
  await migrarCotizaciones();
  await migrarReviews();
  await migrarPortfolio();

  console.log('\n✅ Migración completada!');
  console.log('\n📊 Verifica los datos en tu panel de Supabase: https://app.supabase.com');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  ejecutarMigracion()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export { ejecutarMigracion };
