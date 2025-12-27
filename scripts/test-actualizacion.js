require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testActualizacion() {
  console.log('🧪 Probando actualización de perfil...\n');

  // Obtener el primer perfil de Alejandro
  const { data: profesionales, error: errorGet } = await supabase
    .from('profesionales')
    .select('*')
    .eq('email', 'yfuelaluz@gmail.com')
    .single();

  if (errorGet) {
    console.log('❌ Error al obtener profesional:', errorGet.message);
    process.exit(1);
  }

  console.log('✅ Profesional obtenido:', profesionales.nombre_completo);
  console.log('   ID:', profesionales.id);
  console.log('   Email:', profesionales.email);
  console.log('   RUT:', profesionales.rut);
  console.log('\n📝 Intentando actualizar descripción...\n');

  // Intentar actualizar solo la descripción
  const { data: actualizado, error: errorUpdate } = await supabase
    .from('profesionales')
    .update({ 
      descripcion: 'Electricista profesional con más de 20 años de experiencia. Especialista en instalaciones residenciales, comerciales e industriales.'
    })
    .eq('id', profesionales.id)
    .select()
    .single();

  if (errorUpdate) {
    console.log('❌ ERROR al actualizar:', errorUpdate.message);
    console.log('   Código:', errorUpdate.code);
    console.log('   Detalles:', JSON.stringify(errorUpdate, null, 2));
  } else {
    console.log('✅ Actualización exitosa!');
    console.log('   Nueva descripción:', actualizado.descripcion);
  }

  process.exit(0);
}

testActualizacion();
