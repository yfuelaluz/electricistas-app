require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarFotos() {
  console.log('📸 Actualizando fotos de todos los perfiles...\n');

  // Primero obtener la foto del perfil de electricista
  const { data: electricista, error: errorGet } = await supabase
    .from('profesionales')
    .select('foto_perfil')
    .eq('email', 'yfuelaluz@gmail.com')
    .single();

  if (errorGet || !electricista) {
    console.log('❌ Error al obtener foto del electricista:', errorGet?.message);
    process.exit(1);
  }

  const fotoCorrecta = electricista.foto_perfil;
  console.log('✅ Foto del electricista:', fotoCorrecta);

  // Lista de emails a actualizar
  const emails = [
    'yfuelaluz@hotmail.com',  // Constructor
    'yfuelaluz+carpintero@gmail.com',
    'yfuelaluz+planos@hotmail.com',
    'yfuelaluz+sec@gmail.com',
    'yfuelaluz+fotovoltaico@hotmail.com'
  ];

  console.log('\n📋 Actualizando fotos para los otros perfiles...\n');

  for (const email of emails) {
    const { data, error } = await supabase
      .from('profesionales')
      .update({ foto_perfil: fotoCorrecta })
      .eq('email', email)
      .select();

    if (error) {
      console.log(`❌ Error al actualizar ${email}:`, error.message);
    } else {
      console.log(`✅ Actualizado ${email}`);
    }
  }

  console.log('\n✨ Proceso completado!');
  process.exit(0);
}

actualizarFotos();
