require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function eliminarYRecrear() {
  console.log('🗑️  Eliminando profesionales ficticios...\n');

  // Eliminar los 4 ficticios
  const emailsEliminar = [
    'carpintero.yfuelaluz@gmail.com',
    'planos.yfuelaluz@hotmail.com',
    'sec.yfuelaluz@gmail.com',
    'fotovoltaico.yfuelaluz@hotmail.com'
  ];

  for (const email of emailsEliminar) {
    const { error } = await supabase
      .from('profesionales')
      .delete()
      .eq('email', email);
    
    if (error) {
      console.log(`⚠️  No se pudo eliminar ${email}`);
    } else {
      console.log(`✅ Eliminado: ${email}`);
    }
  }

  console.log('\n✅ Limpieza completada!\n');
  process.exit(0);
}

eliminarYRecrear();
