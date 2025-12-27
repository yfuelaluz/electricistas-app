require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function copiarFoto() {
  console.log('📸 Copiando foto de perfil...\n');

  // Obtener foto del perfil electricista
  const { data: electricista, error: errorGet } = await supabase
    .from('profesionales')
    .select('foto_perfil')
    .eq('email', 'yfuelaluz@gmail.com')
    .single();

  if (errorGet) {
    console.log('❌ Error al obtener foto:', errorGet.message);
    process.exit(1);
  }

  console.log('✅ Foto obtenida del perfil electricista');
  console.log('   URL:', electricista.foto_perfil || '(sin foto)');

  // Actualizar perfil carpintero con la misma foto
  const { data: carpintero, error: errorUpdate } = await supabase
    .from('profesionales')
    .update({ foto_perfil: electricista.foto_perfil })
    .eq('email', 'yfuelaluz+carpintero@gmail.com')
    .select()
    .single();

  if (errorUpdate) {
    console.log('❌ Error al actualizar:', errorUpdate.message);
    process.exit(1);
  }

  console.log('\n✅ Foto copiada al perfil CARPINTERO exitosamente!\n');
  process.exit(0);
}

copiarFoto();
