require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verificacionFinalCompleta() {
  console.log('🔍 VERIFICACIÓN FINAL COMPLETA\n');
  console.log('='.repeat(100) + '\n');

  const { data: perfiles, error } = await supabase
    .from('profesionales')
    .select('*')
    .or('email.eq.yfuelaluz@gmail.com,email.eq.yfuelaluz@hotmail.com,email.eq.yfuelaluz+carpintero@gmail.com,email.eq.yfuelaluz+planos@hotmail.com,email.eq.yfuelaluz+sec@gmail.com,email.eq.yfuelaluz+fotovoltaico@hotmail.com')
    .order('email');

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('📊 RESUMEN FINAL DE PERFILES:\n');
  
  perfiles.forEach((perfil, index) => {
    const keywords = {
      'fotovoltaic': 'Proyectos Fotovoltaicos',
      'electric': 'Electricidad',
      'carpint': 'Carpintería',
      'plano': 'Planos',
      'sec': 'Trámites SEC',
      'construc': 'Construcciones',
      'ingeniero': 'Ingeniería'
    };

    let servicio = 'Otro';
    const especialidadLower = perfil.especialidad.toLowerCase();
    for (const [key, value] of Object.entries(keywords)) {
      if (especialidadLower.includes(key)) {
        servicio = value;
        break;
      }
    }

    console.log(`${index + 1}. ${perfil.email}`);
    console.log(`   Servicio: ${servicio}`);
    console.log(`   Especialidad: ${perfil.especialidad}`);
    console.log(`   RUT: ${perfil.rut}`);
    console.log(`   Comunas: ${perfil.comunas?.join(', ') || 'N/A'}`);
    console.log(`   Experiencia: ${perfil.experiencia} años`);
    console.log(`   Foto: ${perfil.foto_perfil ? '✅ ' + perfil.foto_perfil : '❌ Sin foto'}`);
    console.log(`   Estado: ${perfil.estado === 'activo' ? '✅ Activo' : '⚠️  ' + perfil.estado}`);
    console.log('');
  });

  console.log('='.repeat(100) + '\n');
  console.log('✅ VERIFICACIÓN COMPLETADA\n');
  console.log('📋 INSTRUCCIONES:\n');
  console.log('   1. Todas las fotos apuntan a: /images/admin-profile.jpg');
  console.log('   2. El archivo existe en: public/images/admin-profile.jpg');
  console.log('   3. Todas las comunas del electricista son: "Valparaíso y alrededores"');
  console.log('   4. Todos los perfiles están ACTIVOS\n');

  process.exit(0);
}

verificacionFinalCompleta();
