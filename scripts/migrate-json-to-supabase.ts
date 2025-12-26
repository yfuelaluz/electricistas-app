/**
 * Script de migración de datos JSON a Supabase
 * Ejecutar con: npx tsx scripts/migrate-json-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Cargar variables de entorno desde .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrarProfesionales() {
  console.log('\n📋 Migrando profesionales...');
  
  const dataPath = path.join(process.cwd(), 'data', 'profesionales.json');
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  No hay archivo profesionales.json');
    return;
  }

  const profesionales = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`   Encontrados: ${profesionales.length} profesionales`);

  // Verificar cuántos ya existen
  const { data: existentes } = await supabase.from('profesionales').select('email');
  const emailsExistentes = new Set(existentes?.map(p => p.email) || []);

  let insertados = 0;
  for (const prof of profesionales) {
    if (emailsExistentes.has(prof.email)) {
      console.log(`   ⏭️  Profesional ${prof.email} ya existe, omitiendo...`);
      continue;
    }

    const { error } = await supabase.from('profesionales').insert([prof]);
    if (error) {
      console.error(`   ❌ Error al insertar ${prof.email}:`, error.message);
    } else {
      console.log(`   ✅ Insertado: ${prof.nombre} (${prof.email})`);
      insertados++;
    }
  }

  console.log(`   📊 Total insertados: ${insertados} de ${profesionales.length}`);
}

async function migrarClientes() {
  console.log('\n📋 Migrando clientes...');
  
  const dataPath = path.join(process.cwd(), 'data', 'clientes.json');
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  No hay archivo clientes.json');
    return;
  }

  const clientes = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`   Encontrados: ${clientes.length} clientes`);

  const { data: existentes } = await supabase.from('clientes').select('email');
  const emailsExistentes = new Set(existentes?.map(c => c.email) || []);

  let insertados = 0;
  for (const cliente of clientes) {
    if (emailsExistentes.has(cliente.email)) {
      console.log(`   ⏭️  Cliente ${cliente.email} ya existe, omitiendo...`);
      continue;
    }

    const { error } = await supabase.from('clientes').insert([cliente]);
    if (error) {
      console.error(`   ❌ Error al insertar ${cliente.email}:`, error.message);
    } else {
      console.log(`   ✅ Insertado: ${cliente.nombre} (${cliente.email})`);
      insertados++;
    }
  }

  console.log(`   📊 Total insertados: ${insertados} de ${clientes.length}`);
}

async function migrarCotizaciones() {
  console.log('\n📋 Migrando cotizaciones...');
  
  const dataPath = path.join(process.cwd(), 'data', 'cotizaciones.json');
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  No hay archivo cotizaciones.json');
    return;
  }

  const cotizaciones = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`   Encontradas: ${cotizaciones.length} cotizaciones`);

  const { data: existentes } = await supabase.from('cotizaciones').select('id');
  const idsExistentes = new Set(existentes?.map(c => c.id) || []);

  let insertados = 0;
  for (const cotizacion of cotizaciones) {
    if (idsExistentes.has(cotizacion.id)) {
      console.log(`   ⏭️  Cotización ${cotizacion.id} ya existe, omitiendo...`);
      continue;
    }

    const { error } = await supabase.from('cotizaciones').insert([cotizacion]);
    if (error) {
      console.error(`   ❌ Error al insertar ${cotizacion.id}:`, error.message);
    } else {
      console.log(`   ✅ Insertada: ${cotizacion.id} (${cotizacion.servicio.tipo})`);
      insertados++;
    }
  }

  console.log(`   📊 Total insertadas: ${insertados} de ${cotizaciones.length}`);
}

async function main() {
  console.log('🚀 Iniciando migración de JSON a Supabase...\n');
  console.log(`📡 Conectando a: ${supabaseUrl}`);

  try {
    await migrarProfesionales();
    await migrarClientes();
    await migrarCotizaciones();

    console.log('\n✅ ¡Migración completada exitosamente!\n');
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  }
}

main();
