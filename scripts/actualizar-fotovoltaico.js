require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarFotovoltaico() {
  console.log('☀️ Actualizando perfil de FOTOVOLTAICO...\n');

  // Obtener foto del perfil electricista
  const { data: electricista } = await supabase
    .from('profesionales')
    .select('foto_perfil')
    .eq('email', 'yfuelaluz@gmail.com')
    .single();

  const { data, error } = await supabase
    .from('profesionales')
    .update({
      especialidad: 'Ingeniero Eléctrico',
      comunas: ['Valparaíso y alrededores'],
      experiencia: 3,
      certificaciones: 'SEC A',
      foto_perfil: electricista?.foto_perfil || ''
    })
    .eq('email', 'yfuelaluz+fotovoltaico@hotmail.com')
    .select()
    .single();

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Perfil de FOTOVOLTAICO actualizado exitosamente!\n');
  console.log('📋 Cambios aplicados:');
  console.log('   ✅ Especialidad: Ingeniero Eléctrico');
  console.log('   ✅ Comunas: Valparaíso y alrededores');
  console.log('   ✅ Experiencia: 3 años');
  console.log('   ✅ Certificaciones: SEC A');
  console.log('   ✅ Foto: /images/admin-profile.jpg\n');
  
  process.exit(0);
}

actualizarFotovoltaico();
