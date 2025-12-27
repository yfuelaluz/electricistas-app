require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verificarConstructor() {
  console.log('🔍 Buscando perfil de Constructor (yfuelaluz@hotmail.com)...\n');

  const { data, error } = await supabase
    .from('profesionales')
    .select('*')
    .eq('email', 'yfuelaluz@hotmail.com');

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  if (data.length === 0) {
    console.log('❌ NO EXISTE el perfil de Constructor!');
    console.log('📝 Necesito crearlo...\n');
  } else {
    console.log('✅ Perfil encontrado:');
    console.log(JSON.stringify(data[0], null, 2));
  }

  // Mostrar todos los perfiles
  const { data: todos } = await supabase
    .from('profesionales')
    .select('email, especialidad')
    .eq('nombre_completo', 'Alejandro Fernández')
    .order('email');

  console.log('\n📊 TODOS LOS PERFILES EXISTENTES:');
  todos.forEach((p, i) => {
    console.log(`${i + 1}. ${p.email} - ${p.especialidad}`);
  });

  process.exit(0);
}

verificarConstructor();
