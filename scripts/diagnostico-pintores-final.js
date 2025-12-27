require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function diagnosticoPintores() {
  console.log('🔍 DIAGNÓSTICO: ¿Quién aparece en Pintores?\n');

  const { data: todos } = await supabase
    .from('profesionales')
    .select('*')
    .eq('estado', 'activo');

  console.log(`Total profesionales activos: ${todos.length}\n`);

  // Buscar con keyword "pintor"
  const pintores = todos.filter(p => {
    const esp = (p.especialidad || '').toLowerCase();
    return esp.includes('pintor');
  });

  console.log(`Profesionales que contienen "pintor": ${pintores.length}\n`);

  if (pintores.length > 0) {
    console.log('❌ ENCONTRADOS EN PINTORES:\n');
    pintores.forEach(p => {
      console.log(`   Email: ${p.email}`);
      console.log(`   Especialidad: "${p.especialidad}"`);
      console.log(`   Foto: ${p.foto_perfil}\n`);
    });
  }

  // Mostrar todos los perfiles de Alejandro
  console.log('\n📋 TODOS LOS PERFILES DE ALEJANDRO:\n');
  const alejandros = todos.filter(p => p.nombre_completo === 'Alejandro Fernández');
  alejandros.forEach(p => {
    console.log(`${p.email}:`);
    console.log(`   Especialidad: "${p.especialidad}"`);
    console.log(`   Foto: ${p.foto_perfil || 'SIN FOTO'}`);
    console.log('');
  });

  process.exit(0);
}

diagnosticoPintores();
