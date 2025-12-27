require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function corregirTodoFinal() {
  console.log('🔧 CORRECCIÓN FINAL DE TODOS LOS PERFILES\n');
  console.log('='.repeat(80) + '\n');

  // 1. Actualizar yfuelaluz@gmail.com - ELECTRICISTA
  console.log('1️⃣ Actualizando perfil ELECTRICISTA...');
  const { error: e1 } = await supabase
    .from('profesionales')
    .update({
      rut: '12.230.359-4',
      especialidad: 'Ingeniero Eléctrico',
      comunas: ['Valparaíso y alrededores'],
      experiencia: 25,
      certificaciones: 'SEC A',
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz@gmail.com');
  
  if (e1) console.log('❌ Error:', e1.message);
  else console.log('✅ Electricista actualizado (RUT: 12.230.359-4, Experiencia: 25 años)\n');

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
  else console.log('✅ Constructor actualizado (Especialidad: Ingeniero)\n');

  // 3. Actualizar Planos
  console.log('3️⃣ Actualizando perfil PLANOS...');
  const { error: e3 } = await supabase
    .from('profesionales')
    .update({
      especialidad: 'Ingeniero',
      certificaciones: 'SEC A',
      experiencia: 10,
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz+planos@hotmail.com');
  
  if (e3) console.log('❌ Error:', e3.message);
  else console.log('✅ Planos actualizado (Especialidad: Ingeniero, Experiencia: 10 años)\n');

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
  else console.log('✅ Fotovoltaico actualizado (Especialidad: Proyectos Fotovoltaicos)\n');

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

  console.log('\n✨ CORRECCIÓN COMPLETADA - Verificando...\n');
  
  // Verificar todos
  const { data: perfiles } = await supabase
    .from('profesionales')
    .select('*')
    .eq('nombre_completo', 'Alejandro Fernández')
    .order('email');

  console.log('📊 RESUMEN DE PERFILES:\n');
  perfiles.forEach((p) => {
    console.log(`📋 ${p.email}`);
    console.log(`   ├─ Especialidad: ${p.especialidad}`);
    console.log(`   ├─ RUT: ${p.rut}`);
    console.log(`   ├─ Experiencia: ${p.experiencia} años`);
    console.log(`   ├─ Certificaciones: ${p.certificaciones || 'N/A'}`);
    console.log(`   ├─ Comunas: ${p.comunas?.join(', ') || 'N/A'}`);
    console.log(`   └─ Foto: ${p.foto_perfil ? '✅' : '❌'}\n`);
  });

  process.exit(0);
}

corregirTodoFinal();
