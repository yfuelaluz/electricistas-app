require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verificarPintores() {
  const { data, error } = await supabase
    .from('profesionales')
    .select('*');

  if (error) {
    console.log('ERROR:', error.message);
  } else {
    const pintores = data.filter(p => 
      p.especialidad && p.especialidad.toLowerCase().includes('pint')
    );
    
    if (pintores.length > 0) {
      console.log('🎨 Profesionales de PINTURA encontrados:\n');
      pintores.forEach(p => {
        console.log(`- ${p.nombre_completo} (${p.email})`);
        console.log(`  ID: ${p.id}`);
        console.log(`  Especialidad: ${p.especialidad}\n`);
      });
    } else {
      console.log('No hay profesionales con especialidad en pintura.');
    }
  }
  process.exit(0);
}

verificarPintores();
