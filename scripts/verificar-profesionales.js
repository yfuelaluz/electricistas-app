require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verificar() {
  const { data, error } = await supabase
    .from('profesionales')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log('ERROR:', error.message);
  } else {
    console.log('\n📋 PROFESIONALES REGISTRADOS:\n');
    data.forEach((p, i) => {
      console.log(`${i + 1}. ${p.nombre_completo}`);
      console.log(`   📧 Email: ${p.email}`);
      console.log(`   💼 Especialidad: ${p.especialidad}`);
      console.log(`   ⭐ Valoración: ${p.valoracion}`);
      console.log(`   🔨 Trabajos: ${p.trabajos_realizados}`);
      console.log(`   👔 Plan: ${p.plan}`);
      console.log(`   📍 Estado: ${p.estado}`);
      console.log('');
    });
    console.log(`\n✅ Total: ${data.length} profesionales registrados\n`);
  }
  process.exit(0);
}

verificar();
