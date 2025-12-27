require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verificarFotosActuales() {
  console.log('🔍 Verificando fotos actuales en la base de datos...\n');

  const { data: perfiles } = await supabase
    .from('profesionales')
    .select('email, foto_perfil')
    .or('email.eq.yfuelaluz@gmail.com,email.eq.yfuelaluz@hotmail.com,email.eq.yfuelaluz+carpintero@gmail.com,email.eq.yfuelaluz+planos@hotmail.com,email.eq.yfuelaluz+sec@gmail.com,email.eq.yfuelaluz+fotovoltaico@hotmail.com');

  perfiles.forEach(p => {
    console.log(`${p.email}:`);
    console.log(`   Foto actual: ${p.foto_perfil || 'Sin foto'}\n`);
  });

  process.exit(0);
}

verificarFotosActuales();
