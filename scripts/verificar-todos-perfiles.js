require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verificarPerfiles() {
  console.log('🔍 VERIFICACIÓN COMPLETA DE PERFILES\n');
  console.log('='.repeat(80) + '\n');

  const { data: profesionales, error } = await supabase
    .from('profesionales')
    .select('*')
    .eq('nombre_completo', 'Alejandro Fernández')
    .order('id');

  if (error) {
    console.log('❌ ERROR:', error.message);
    process.exit(1);
  }

  profesionales.forEach((p, index) => {
    console.log(`📋 PERFIL ${index + 1}:`);
    console.log(`   Email: ${p.email}`);
    console.log(`   RUT: ${p.rut}`);
    console.log(`   Especialidad: ${p.especialidad}`);
    console.log(`   Comunas: ${p.comunas?.join(', ') || 'N/A'}`);
    console.log(`   Experiencia: ${p.experiencia || 'N/A'}`);
    console.log(`   Certificaciones: ${p.certificaciones || 'N/A'}`);
    console.log(`   Foto: ${p.foto_perfil || '❌ SIN FOTO'}`);
    console.log(`   Estado: ${p.estado}`);
    console.log(`   Plan: ${p.plan}`);
    console.log('-'.repeat(80) + '\n');
  });

  console.log(`\n✅ Total de perfiles encontrados: ${profesionales.length}\n`);
  process.exit(0);
}

verificarPerfiles();
