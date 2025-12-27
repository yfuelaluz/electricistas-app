require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function correccionFinalTotal() {
  console.log('🔧 CORRECCIÓN FINAL COMPLETA\n');
  console.log('='.repeat(100) + '\n');

  // 1. ELECTRICISTA (yfuelaluz@gmail.com) - Actualizar especialidad para que NO aparezca en Pintores
  console.log('1️⃣ Actualizando ELECTRICISTA...');
  const { error: e1 } = await supabase
    .from('profesionales')
    .update({
      especialidad: 'Electricidad Integral',
      rut: '12.230.359-4',
      comunas: ['Valparaíso y alrededores'],
      experiencia: 25,
      certificaciones: 'SEC A',
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz@gmail.com');
  
  if (e1) console.log('   ❌ Error:', e1.message);
  else console.log('   ✅ Electricista actualizado\n');

  // 2. CONSTRUCTOR (yfuelaluz@hotmail.com) - Cambiar a "Constructor" para que aparezca
  console.log('2️⃣ Actualizando CONSTRUCTOR...');
  const { error: e2 } = await supabase
    .from('profesionales')
    .update({
      especialidad: 'Constructor',
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz@hotmail.com');
  
  if (e2) console.log('   ❌ Error:', e2.message);
  else console.log('   ✅ Constructor actualizado\n');

  // 3. PLANOS (yfuelaluz+planos@hotmail.com) - Cambiar a "Arquitectura y diseño de planos"
  console.log('3️⃣ Actualizando PLANOS...');
  const { error: e3 } = await supabase
    .from('profesionales')
    .update({
      especialidad: 'Arquitectura y diseño de planos',
      certificaciones: 'SEC A',
      experiencia: 10,
      foto_perfil: '/images/admin-profile.jpg'
    })
    .eq('email', 'yfuelaluz+planos@hotmail.com');
  
  if (e3) console.log('   ❌ Error:', e3.message);
  else console.log('   ✅ Planos actualizado\n');

  // 4. FOTOVOLTAICO - Ya está bien
  console.log('4️⃣ Verificando FOTOVOLTAICO...');
  const { data: foto } = await supabase
    .from('profesionales')
    .select('especialidad')
    .eq('email', 'yfuelaluz+fotovoltaico@hotmail.com')
    .single();
  console.log(`   ✅ Fotovoltaico: ${foto?.especialidad}\n`);

  // 5. SEC - Ya está bien
  console.log('5️⃣ Verificando SEC...');
  const { data: sec } = await supabase
    .from('profesionales')
    .select('especialidad')
    .eq('email', 'yfuelaluz+sec@gmail.com')
    .single();
  console.log(`   ✅ SEC: ${sec?.especialidad}\n`);

  // 6. CARPINTERO - Ya está bien
  console.log('6️⃣ Verificando CARPINTERO...');
  const { data: carp } = await supabase
    .from('profesionales')
    .select('especialidad')
    .eq('email', 'yfuelaluz+carpintero@gmail.com')
    .single();
  console.log(`   ✅ Carpintero: ${carp?.especialidad}\n`);

  console.log('='.repeat(100) + '\n');
  console.log('✨ CORRECCIÓN COMPLETADA\n');

  // Verificación final
  console.log('📊 VERIFICACIÓN POR SERVICIO:\n');

  const { data: todos } = await supabase
    .from('profesionales')
    .select('*')
    .or('email.eq.yfuelaluz@gmail.com,email.eq.yfuelaluz@hotmail.com,email.eq.yfuelaluz+carpintero@gmail.com,email.eq.yfuelaluz+planos@hotmail.com,email.eq.yfuelaluz+sec@gmail.com,email.eq.yfuelaluz+fotovoltaico@hotmail.com');

  const servicios = {
    'Construcciones nuevas': ['construc', 'constructor'],
    'Planos': ['plano', 'arquitect'],
    'Trámites SEC': ['sec', 'tramite'],
    'Proyectos Fotovoltaicos': ['fotovolta'],
    'Pintores': ['pint', 'pintor'],
    'Carpintería': ['carpint'],
    'Electricidad': ['electric']
  };

  for (const [servicio, keywords] of Object.entries(servicios)) {
    const encontrados = todos.filter(p => {
      const esp = (p.especialidad || '').toLowerCase();
      return keywords.some(k => esp.includes(k));
    });
    console.log(`${servicio}: ${encontrados.length} profesional(es)`);
    encontrados.forEach(p => {
      console.log(`   - ${p.email}: "${p.especialidad}"`);
    });
  }

  process.exit(0);
}

correccionFinalTotal();
