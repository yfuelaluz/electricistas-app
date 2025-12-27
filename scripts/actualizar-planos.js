require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarPlanos() {
  console.log('📐 Actualizando perfil de PLANOS...\n');

  // Obtener foto del perfil electricista
  const { data: electricista } = await supabase
    .from('profesionales')
    .select('foto_perfil')
    .eq('email', 'yfuelaluz@gmail.com')
    .single();

  // Hashear la nueva contraseña
  const passwordHash = await bcrypt.hash('Alesol#1999fer#26', 10);

  const { data, error } = await supabase
    .from('profesionales')
    .update({
      comunas: ['Valparaíso y alrededores'],
      password_hash: passwordHash,
      foto_perfil: electricista?.foto_perfil || ''
    })
    .eq('email', 'yfuelaluz+planos@hotmail.com')
    .select()
    .single();

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Perfil de PLANOS actualizado exitosamente!\n');
  console.log('📋 Cambios aplicados:');
  console.log('   ✅ Comunas: Valparaíso y alrededores');
  console.log('   ✅ Contraseña: Alesol#1999fer#26');
  console.log('   ✅ Foto: /images/admin-profile.jpg\n');
  
  process.exit(0);
}

actualizarPlanos();
