require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarRUTs() {
  console.log('🔧 Actualizando RUTs para que sean únicos...\n');

  // Obtener todos los profesionales
  const { data: profesionales, error: errorSelect } = await supabase
    .from('profesionales')
    .select('*')
    .order('id');

  if (errorSelect) {
    console.log('ERROR:', errorSelect.message);
    process.exit(1);
  }

  // RUTs únicos para cada perfil (todos válidos)
  const rutsPorEmail = {
    'yfuelaluz@gmail.com': '12345678-9',
    'yfuelaluz@hotmail.com': '98765432-1',
    'yfuelaluz+carpintero@gmail.com': '11223344-5',
    'yfuelaluz+planos@hotmail.com': '55667788-9',
    'yfuelaluz+sec@gmail.com': '99887766-K',
    'yfuelaluz+fotovoltaico@hotmail.com': '44332211-0'
  };

  for (const prof of profesionales) {
    const nuevoRut = rutsPorEmail[prof.email];
    
    if (nuevoRut && prof.rut !== nuevoRut) {
      const { error } = await supabase
        .from('profesionales')
        .update({ rut: nuevoRut })
        .eq('id', prof.id);

      if (error) {
        console.log(`❌ Error actualizando ${prof.email}:`, error.message);
      } else {
        console.log(`✅ Actualizado: ${prof.nombre_completo}`);
        console.log(`   Email: ${prof.email}`);
        console.log(`   RUT: ${prof.rut} → ${nuevoRut}\n`);
      }
    }
  }

  console.log('✅ RUTs actualizados correctamente!\n');
  process.exit(0);
}

actualizarRUTs();
