require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verificarFotos() {
  console.log('📸 Verificando fotos de todos los perfiles...\n');

  const { data: profesionales, error } = await supabase
    .from('profesionales')
    .select('nombre_completo, email, foto_perfil, especialidad')
    .order('id');

  if (error) {
    console.log('ERROR:', error.message);
    process.exit(1);
  }

  profesionales.forEach(p => {
    console.log(`${p.nombre_completo} (${p.especialidad})`);
    console.log(`  Email: ${p.email}`);
    console.log(`  Foto: ${p.foto_perfil || '❌ SIN FOTO'}\n`);
  });

  process.exit(0);
}

verificarFotos();
