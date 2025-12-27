require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function correccionFinal() {
  console.log('🔧 CORRECCIÓN FINAL\n');
  console.log('='.repeat(80) + '\n');

  // 1. Actualizar foto del electricista
  console.log('1️⃣ Actualizando foto del electricista...');
  const { error: e1 } = await supabase
    .from('profesionales')
    .update({ foto_perfil: '/images/Profesional-icon.jpg' })
    .eq('email', 'yfuelaluz@gmail.com');
  
  if (e1) console.log('   ❌ Error:', e1.message);
  else console.log('   ✅ Foto actualizada\n');

  // 2. Actualizar foto del constructor (faltaba)
  console.log('2️⃣ Actualizando foto del constructor...');
  const { error: e2 } = await supabase
    .from('profesionales')
    .update({ foto_perfil: '/images/Profesional-icon.jpg' })
    .eq('email', 'yfuelaluz@hotmail.com');
  
  if (e2) console.log('   ❌ Error:', e2.message);
  else console.log('   ✅ Foto actualizada\n');

  // 3. Verificar total de profesionales
  console.log('3️⃣ Verificando profesionales activos...');
  const { data: todos, count } = await supabase
    .from('profesionales')
    .select('*', { count: 'exact' })
    .eq('estado', 'activo');

  console.log(`   Total profesionales activos: ${count}\n`);

  // 4. Verificar que NADIE tenga "pintor" en especialidad
  const conPintor = todos?.filter(p => 
    (p.especialidad || '').toLowerCase().includes('pintor')
  ) || [];

  console.log('4️⃣ Verificando Pintores...');
  if (conPintor.length === 0) {
    console.log('   ✅ Ningún profesional contiene "pintor" en especialidad\n');
  } else {
    console.log(`   ⚠️  ${conPintor.length} profesional(es) con "pintor":\n`);
    conPintor.forEach(p => {
      console.log(`      - ${p.email}: "${p.especialidad}"`);
    });
  }

  // 5. Verificar rutas de fotos
  console.log('\n5️⃣ Verificando fotos de todos los perfiles:\n');
  const alejandros = todos?.filter(p => p.nombre_completo === 'Alejandro Fernández') || [];
  alejandros.forEach(p => {
    const fotoOK = p.foto_perfil === '/images/Profesional-icon.jpg';
    console.log(`   ${fotoOK ? '✅' : '❌'} ${p.email}`);
    console.log(`      Foto: ${p.foto_perfil || 'SIN FOTO'}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ CORRECCIÓN COMPLETADA\n');

  process.exit(0);
}

correccionFinal();
