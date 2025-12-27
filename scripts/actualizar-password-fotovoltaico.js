require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarPasswordFotovoltaico() {
  console.log('🔒 Actualizando contraseña de FOTOVOLTAICO...\n');

  const passwordHash = await bcrypt.hash('Fer#53alejo#1972', 10);

  const { data, error } = await supabase
    .from('profesionales')
    .update({ password_hash: passwordHash })
    .eq('email', 'yfuelaluz+fotovoltaico@hotmail.com')
    .select()
    .single();

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Contraseña actualizada exitosamente!');
  console.log('   Nueva contraseña: Fer#53alejo#1972\n');
  
  process.exit(0);
}

actualizarPasswordFotovoltaico();
