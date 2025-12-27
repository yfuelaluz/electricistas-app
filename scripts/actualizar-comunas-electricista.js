require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarComunasElectricista() {
  console.log('🔧 Actualizando comunas del electricista...\n');

  const { error } = await supabase
    .from('profesionales')
    .update({
      comunas: ['Valparaíso y alrededores']
    })
    .eq('email', 'yfuelaluz@gmail.com');

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Comunas actualizadas a: "Valparaíso y alrededores"\n');

  // Verificar
  const { data } = await supabase
    .from('profesionales')
    .select('email, comunas')
    .eq('email', 'yfuelaluz@gmail.com')
    .single();

  console.log('📋 Verificación:');
  console.log(`   Email: ${data.email}`);
  console.log(`   Comunas: ${data.comunas.join(', ')}`);

  process.exit(0);
}

actualizarComunasElectricista();
