/**
 * Script para probar inserción directa en Supabase
 * Esto nos ayudará a identificar exactamente qué está fallando
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno SUPABASE');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsercion() {
  console.log('🔍 Verificando conexión a Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey?.substring(0, 20) + '...');

  try {
    // 1. Verificar conexión
    console.log('\n1️⃣ Verificando estructura de tabla profesionales...');
    const { data: testQuery, error: testError } = await supabase
      .from('profesionales')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Error al consultar tabla:', testError);
      return;
    }
    console.log('✅ Conexión exitosa a Supabase');

    // 2. Preparar datos de prueba
    console.log('\n2️⃣ Preparando datos de prueba...');
    const passwordHash = await bcrypt.hash('test123', 10);
    
    const datosTest = {
      nombreCompleto: 'Juan Pérez TEST',
      rut: '11111111-1',
      email: `test${Date.now()}@test.com`, // Email único
      telefono: '+56912345678',
      passwordHash,
      especialidad: 'Electricista',
      comunas: ['Santiago', 'Providencia'],
      experiencia: 5,
      certificaciones: 'SEC Clase A',
      descripcion: 'Profesional de prueba',
      plan: 'starter',
      estado: 'pendiente',
      valoracion: 0,
      trabajosRealizados: 0,
      leadsUsados: 0
    };

    console.log('Datos a insertar:', JSON.stringify(datosTest, null, 2));

    // 3. Intentar inserción
    console.log('\n3️⃣ Intentando inserción...');
    const { data: resultado, error: errorInsercion } = await supabase
      .from('profesionales')
      .insert([datosTest])
      .select();

    if (errorInsercion) {
      console.error('❌ ERROR EN INSERCIÓN:', errorInsercion);
      console.error('Código:', errorInsercion.code);
      console.error('Mensaje:', errorInsercion.message);
      console.error('Detalles:', errorInsercion.details);
      console.error('Hint:', errorInsercion.hint);
      return;
    }

    console.log('✅ INSERCIÓN EXITOSA!');
    console.log('Profesional creado:', resultado);

    // 4. Verificar que se guardó
    console.log('\n4️⃣ Verificando inserción...');
    const { data: verificacion, error: errorVerificacion } = await supabase
      .from('profesionales')
      .select('*')
      .eq('email', datosTest.email)
      .single();

    if (errorVerificacion) {
      console.error('❌ Error al verificar:', errorVerificacion);
      return;
    }

    console.log('✅ Verificación exitosa!');
    console.log('Datos guardados:', verificacion);

    // 5. Limpiar (opcional)
    console.log('\n5️⃣ ¿Deseas eliminar el registro de prueba? (Cancelar en 5 segundos)');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const { error: errorDelete } = await supabase
      .from('profesionales')
      .delete()
      .eq('id', resultado[0].id);

    if (errorDelete) {
      console.error('⚠️ No se pudo eliminar el registro de prueba');
    } else {
      console.log('✅ Registro de prueba eliminado');
    }

  } catch (error) {
    console.error('❌ ERROR GENERAL:', error);
  }
}

// Ejecutar prueba
testInsercion()
  .then(() => {
    console.log('\n✅ Prueba completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en prueba:', error);
    process.exit(1);
  });
