require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function diagnosticoPintores() {
  console.log('🔍 DIAGNÓSTICO: ¿Quién aparece en Pintores?\n');

  const { data: todos } = await supabase
    .from('profesionales')
    .select('*')
    .or('email.eq.yfuelaluz@gmail.com,email.eq.yfuelaluz@hotmail.com,email.eq.yfuelaluz+carpintero@gmail.com,email.eq.yfuelaluz+planos@hotmail.com,email.eq.yfuelaluz+sec@gmail.com,email.eq.yfuelaluz+fotovoltaico@hotmail.com');

  console.log('Buscando con keyword "pintor":\n');
  
  todos.forEach(p => {
    const esp = (p.especialidad || '').toLowerCase();
    if (esp.includes('pintor')) {
      console.log(`❌ ENCONTRADO: ${p.email}`);
      console.log(`   Especialidad: "${p.especialidad}"`);
      console.log(`   Contiene "pintor": SÍ\n`);
    } else {
      console.log(`✅ OK: ${p.email}`);
      console.log(`   Especialidad: "${p.especialidad}"`);
      console.log(`   Contiene "pintor": NO\n`);
    }
  });

  console.log('\nTODAS LAS ESPECIALIDADES:\n');
  todos.forEach(p => {
    console.log(`${p.email}: "${p.especialidad}"`);
  });

  process.exit(0);
}

diagnosticoPintores();
