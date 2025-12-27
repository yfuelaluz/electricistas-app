require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function removerFotosTemporalmente() {
  console.log('🔧 Removiendo fotos temporalmente (usará icono por defecto)...\n');

  const emails = [
    'yfuelaluz@gmail.com',
    'yfuelaluz@hotmail.com',
    'yfuelaluz+carpintero@gmail.com',
    'yfuelaluz+planos@hotmail.com',
    'yfuelaluz+sec@gmail.com',
    'yfuelaluz+fotovoltaico@hotmail.com'
  ];

  for (const email of emails) {
    const { error } = await supabase
      .from('profesionales')
      .update({ foto_perfil: '' })
      .eq('email', email);

    if (error) {
      console.log(`❌ Error en ${email}:`, error.message);
    } else {
      console.log(`✅ ${email} - foto removida`);
    }
  }

  console.log('\n✅ Fotos removidas. Ahora usarán el icono por defecto.');
  console.log('\n📸 PARA AGREGAR TU FOTO PERSONAL:');
  console.log('   1. Guarda tu foto como "mi-foto.jpg" en la carpeta public/images/');
  console.log('   2. Avísame y actualizaré todos los perfiles con esa foto\n');

  process.exit(0);
}

removerFotosTemporalmente();
