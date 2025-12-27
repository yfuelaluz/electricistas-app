require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function diagnosticoCompleto() {
  console.log('🔍 DIAGNÓSTICO COMPLETO\n');
  console.log('='.repeat(100) + '\n');

  const { data: perfiles } = await supabase
    .from('profesionales')
    .select('*')
    .or('email.eq.yfuelaluz@gmail.com,email.eq.yfuelaluz@hotmail.com,email.eq.yfuelaluz+carpintero@gmail.com,email.eq.yfuelaluz+planos@hotmail.com,email.eq.yfuelaluz+sec@gmail.com,email.eq.yfuelaluz+fotovoltaico@hotmail.com')
    .order('email');

  console.log('📊 ANÁLISIS POR SERVICIO:\n');

  const servicios = {
    'Construcciones nuevas': ['construc', 'constructor', 'obra', 'ingeniero'],
    'Planos': ['plano', 'arquitecto', 'diseño'],
    'Trámites SEC': ['sec', 'tramite', 'trámite'],
    'Proyectos Fotovoltaicos': ['fotovolta', 'solar', 'panel'],
    'Pintores': ['pint', 'pintor']
  };

  for (const [servicio, keywords] of Object.entries(servicios)) {
    console.log(`\n🔧 ${servicio}:`);
    console.log(`   Keywords: ${keywords.join(', ')}`);
    
    const encontrados = perfiles.filter(p => {
      const especialidad = (p.especialidad || '').toLowerCase();
      return keywords.some(keyword => especialidad.includes(keyword));
    });

    console.log(`   Profesionales encontrados: ${encontrados.length}`);
    encontrados.forEach(p => {
      console.log(`      - ${p.email}: "${p.especialidad}"`);
    });
  }

  console.log('\n' + '='.repeat(100) + '\n');
  console.log('📋 TODOS LOS PERFILES:\n');

  perfiles.forEach(p => {
    console.log(`${p.email}:`);
    console.log(`   Especialidad: "${p.especialidad}"`);
    console.log(`   Estado: ${p.estado}`);
    console.log('');
  });

  process.exit(0);
}

diagnosticoCompleto();
