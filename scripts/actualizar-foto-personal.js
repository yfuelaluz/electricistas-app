require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarFotosTodos() {
  console.log('📸 Actualizando foto de perfil en los 6 perfiles...\n');

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
      .update({ foto_perfil: '/images/Profesional-icon.jpg' })
      .eq('email', email);

    if (error) {
      console.log(`❌ Error en ${email}:`, error.message);
    } else {
      console.log(`✅ ${email} - foto actualizada`);
    }
  }

  console.log('\n✅ COMPLETADO! Todos los perfiles ahora tienen tu foto personal.\n');
  process.exit(0);
}

actualizarFotosTodos();
