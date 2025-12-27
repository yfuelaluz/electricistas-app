require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarCarpintero() {
  console.log('🔧 Actualizando perfil de CARPINTERO...\n');

  // Hashear la nueva contraseña
  const passwordHash = await bcrypt.hash('FER#21alejo#1972', 10);

  const { data, error } = await supabase
    .from('profesionales')
    .update({
      comunas: ['Valparaíso y alrededores'],
      certificaciones: '',
      descripcion: 'Más de 15 años de experiencia en carpintería fina, muebles a medida y proyectos personalizados.',
      password_hash: passwordHash
    })
    .eq('email', 'yfuelaluz+carpintero@gmail.com')
    .select()
    .single();

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Perfil de CARPINTERO actualizado exitosamente!\n');
  console.log('📋 Cambios aplicados:');
  console.log('   ✅ Comunas: Valparaíso y alrededores');
  console.log('   ✅ Certificaciones: (en blanco)');
  console.log('   ✅ Descripción: Más de 15 años de experiencia...');
  console.log('   ✅ Contraseña: FER#21alejo#1972\n');
  
  process.exit(0);
}

actualizarCarpintero();
