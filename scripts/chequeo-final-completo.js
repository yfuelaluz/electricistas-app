require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function chequeoFinal() {
  console.log('🔍 CHEQUEO FINAL - INCLUYENDO CONSTRUCTOR\n');
  console.log('='.repeat(100) + '\n');

  // Obtener TODOS los perfiles de Alejandro Fernández (sin filtro de nombre exacto)
  const { data: perfiles, error } = await supabase
    .from('profesionales')
    .select('*')
    .or('email.eq.yfuelaluz@gmail.com,email.eq.yfuelaluz@hotmail.com,email.eq.yfuelaluz+carpintero@gmail.com,email.eq.yfuelaluz+planos@hotmail.com,email.eq.yfuelaluz+sec@gmail.com,email.eq.yfuelaluz+fotovoltaico@hotmail.com')
    .order('email');

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  console.log(`📊 Total de perfiles encontrados: ${perfiles.length}\n`);
  console.log('='.repeat(100) + '\n');

  perfiles.forEach((perfil, index) => {
    console.log(`📋 PERFIL ${index + 1}:`);
    console.log(`   Email: ${perfil.email}`);
    console.log(`   Especialidad: ${perfil.especialidad}`);
    console.log(`   RUT: ${perfil.rut}`);
    console.log(`   Estado: ${perfil.estado} ${perfil.estado === 'activo' ? '✅' : '⚠️'}`);
    console.log(`   Foto: ${perfil.foto_perfil ? '✅' : '❌'}`);
    console.log(`   Plan: ${perfil.plan}`);
    console.log('');
  });

  console.log('='.repeat(100) + '\n');
  console.log('✨ RESUMEN POR SERVICIO:\n');
  
  const servicios = {
    'Electricista': 'yfuelaluz@gmail.com',
    'Constructor': 'yfuelaluz@hotmail.com',
    'Carpintero': 'yfuelaluz+carpintero@gmail.com',
    'Planos': 'yfuelaluz+planos@hotmail.com',
    'SEC': 'yfuelaluz+sec@gmail.com',
    'Fotovoltaicos': 'yfuelaluz+fotovoltaico@hotmail.com'
  };

  for (const [servicio, email] of Object.entries(servicios)) {
    const perfil = perfiles.find(p => p.email === email);
    if (perfil) {
      console.log(`✅ ${servicio.padEnd(20)} - ${perfil.especialidad}`);
    } else {
      console.log(`❌ ${servicio.padEnd(20)} - NO ENCONTRADO`);
    }
  }

  console.log('\n' + '='.repeat(100) + '\n');
  process.exit(0);
}

chequeoFinal();
