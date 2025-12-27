require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function correccionElectricistaFinal() {
  console.log('🔧 CORRECCIÓN FINAL DEL PERFIL DE ELECTRICISTA\n');

  const { error } = await supabase
    .from('profesionales')
    .update({
      rut: '12.230.359-4',
      especialidad: 'Ingeniero Eléctrico',
      comunas: ['Valparaíso y alrededores'],
      experiencia: 25,
      certificaciones: 'SEC A',
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz@gmail.com');

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Perfil de electricista actualizado correctamente\n');

  // Verificar
  const { data } = await supabase
    .from('profesionales')
    .select('*')
    .eq('email', 'yfuelaluz@gmail.com')
    .single();

  console.log('📋 DATOS ACTUALIZADOS:');
  console.log(`   Email: ${data.email}`);
  console.log(`   RUT: ${data.rut}`);
  console.log(`   Especialidad: ${data.especialidad}`);
  console.log(`   Comunas: ${data.comunas.join(', ')}`);
  console.log(`   Experiencia: ${data.experiencia} años`);
  console.log(`   Certificaciones: ${data.certificaciones}`);
  console.log(`   Foto: ${data.foto_perfil}`);
  console.log(`   Estado: ${data.estado}\n`);

  process.exit(0);
}

correccionElectricistaFinal();
