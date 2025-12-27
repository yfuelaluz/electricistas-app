require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function corregirTodo() {
  console.log('🔧 CORRIGIENDO TODOS LOS PERFILES\n');
  console.log('='.repeat(80) + '\n');

  // 1. Actualizar yfuelaluz@gmail.com - ELECTRICISTA
  console.log('1️⃣ Actualizando perfil ELECTRICISTA...');
  const { error: e1 } = await supabase
    .from('profesionales')
    .update({
      rut: '12.230.359-4',
      especialidad: 'Ingeniero Eléctrico',
      comunas: ['Valparaíso y alrededores'],
      experiencia: '+25 años',
      certificaciones: 'SEC A',
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz@gmail.com');
  
  if (e1) console.log('❌ Error:', e1.message);
  else console.log('✅ Electricista actualizado\n');

  // 2. Actualizar Constructor - yfuelaluz@hotmail.com
  console.log('2️⃣ Actualizando perfil CONSTRUCTOR...');
  const { error: e2 } = await supabase
    .from('profesionales')
    .update({
      especialidad: 'Ingeniero',
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz@hotmail.com');
  
  if (e2) console.log('❌ Error:', e2.message);
  else console.log('✅ Constructor actualizado\n');

  // 3. Actualizar Planos
  console.log('3️⃣ Actualizando perfil PLANOS...');
  const { error: e3 } = await supabase
    .from('profesionales')
    .update({
      especialidad: 'Ingeniero',
      certificaciones: 'SEC A',
      experiencia: '10 años',
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz+planos@hotmail.com');
  
  if (e3) console.log('❌ Error:', e3.message);
  else console.log('✅ Planos actualizado\n');

  // 4. Actualizar Fotovoltaico - DEBE SER PROYECTOS FOTOVOLTAICOS
  console.log('4️⃣ Actualizando perfil FOTOVOLTAICO...');
  const { error: e4 } = await supabase
    .from('profesionales')
    .update({
      especialidad: 'Proyectos Fotovoltaicos',
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz+fotovoltaico@hotmail.com');
  
  if (e4) console.log('❌ Error:', e4.message);
  else console.log('✅ Fotovoltaico actualizado\n');

  // 5. Actualizar Carpintero
  console.log('5️⃣ Actualizando perfil CARPINTERO...');
  const { error: e5 } = await supabase
    .from('profesionales')
    .update({
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz+carpintero@gmail.com');
  
  if (e5) console.log('❌ Error:', e5.message);
  else console.log('✅ Carpintero actualizado\n');

  // 6. Actualizar SEC
  console.log('6️⃣ Actualizando perfil SEC...');
  const { error: e6 } = await supabase
    .from('profesionales')
    .update({
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz+sec@gmail.com');
  
  if (e6) console.log('❌ Error:', e6.message);
  else console.log('✅ SEC actualizado\n');

  console.log('\n✨ CORRECCIÓN COMPLETADA!\n');
  process.exit(0);
}

corregirTodo();
