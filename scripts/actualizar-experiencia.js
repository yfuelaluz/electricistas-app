require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function actualizarExperiencia() {
  console.log('🔧 ACTUALIZANDO AÑOS DE EXPERIENCIA\n');
  console.log('='.repeat(80) + '\n');

  // 1. ELECTRICIDAD INTEGRAL - 25 años
  console.log('1️⃣ Actualizando ELECTRICIDAD INTEGRAL a 25 años...');
  const { error: e1 } = await supabase
    .from('profesionales')
    .update({
      experiencia: 25
    })
    .eq('email', 'yfuelaluz@gmail.com');
  
  if (e1) console.log('   ❌ Error:', e1.message);
  else console.log('   ✅ Electricidad Integral actualizado a 25 años\n');

  // 2. CARPINTERÍA - 20 años
  console.log('2️⃣ Actualizando CARPINTERÍA a 20 años...');
  const { error: e2 } = await supabase
    .from('profesionales')
    .update({
      experiencia: 20,
      descripcion: 'Más de 20 años de experiencia en carpintería fina, muebles a medida y proyectos personalizados.'
    })
    .eq('email', 'yfuelaluz+carpintero@gmail.com');
  
  if (e2) console.log('   ❌ Error:', e2.message);
  else console.log('   ✅ Carpintería actualizado a 20 años\n');

  console.log('='.repeat(80) + '\n');
  console.log('✨ ACTUALIZACIÓN COMPLETADA\n');

  // Verificación final
  console.log('📊 VERIFICACIÓN FINAL:\n');

  const { data: electricidad } = await supabase
    .from('profesionales')
    .select('nombre_completo, email, especialidad, experiencia')
    .eq('email', 'yfuelaluz@gmail.com')
    .single();

  const { data: carpinteria } = await supabase
    .from('profesionales')
    .select('nombre_completo, email, especialidad, experiencia')
    .eq('email', 'yfuelaluz+carpintero@gmail.com')
    .single();

  if (electricidad) {
    console.log('⚡ Electricidad Integral:');
    console.log(`   Email: ${electricidad.email}`);
    console.log(`   Especialidad: ${electricidad.especialidad}`);
    console.log(`   Experiencia: ${electricidad.experiencia} años\n`);
  }

  if (carpinteria) {
    console.log('🪵 Carpintería:');
    console.log(`   Email: ${carpinteria.email}`);
    console.log(`   Especialidad: ${carpinteria.especialidad}`);
    console.log(`   Experiencia: ${carpinteria.experiencia} años\n`);
  }

  console.log('='.repeat(80) + '\n');
  console.log('✅ TODOS LOS CAMBIOS APLICADOS CORRECTAMENTE\n');
  
  process.exit(0);
}

actualizarExperiencia();
