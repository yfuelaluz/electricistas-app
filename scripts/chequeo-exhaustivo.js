require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function chequeoExhaustivo() {
  console.log('🔍 CHEQUEO EXHAUSTIVO Y MINUCIOSO DE TODOS LOS PERFILES\n');
  console.log('='.repeat(100) + '\n');

  // 1. Activar Constructor
  console.log('⚙️  PASO 1: Activando perfil de Constructor...\n');
  const { error: errorActivar } = await supabase
    .from('profesionales')
    .update({ estado: 'activo' })
    .eq('email', 'yfuelaluz@hotmail.com');

  if (errorActivar) {
    console.log('❌ Error al activar:', errorActivar.message);
  } else {
    console.log('✅ Constructor activado\n');
  }

  // 2. Obtener todos los perfiles
  console.log('📊 PASO 2: Obteniendo todos los perfiles...\n');
  const { data: perfiles, error } = await supabase
    .from('profesionales')
    .select('*')
    .eq('nombre_completo', 'Alejandro Fernández')
    .order('email');

  if (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }

  // 3. Verificación detallada
  console.log('🔍 PASO 3: VERIFICACIÓN DETALLADA DE CADA PERFIL\n');
  console.log('='.repeat(100) + '\n');

  const problemas = [];

  perfiles.forEach((perfil, index) => {
    console.log(`📋 PERFIL ${index + 1}: ${perfil.email}`);
    console.log('─'.repeat(100));
    
    // Datos básicos
    console.log(`   👤 Nombre: ${perfil.nombre_completo}`);
    console.log(`   🆔 RUT: ${perfil.rut}`);
    console.log(`   📧 Email: ${perfil.email}`);
    console.log(`   📱 Teléfono: ${perfil.telefono || 'N/A'}`);
    
    // Especialidad
    console.log(`   💼 Especialidad: ${perfil.especialidad}`);
    if (!perfil.especialidad) {
      problemas.push(`${perfil.email}: Falta especialidad`);
      console.log('      ⚠️  PROBLEMA: Falta especialidad');
    }
    
    // Ubicación
    console.log(`   📍 Comunas: ${perfil.comunas?.join(', ') || 'N/A'}`);
    if (!perfil.comunas || perfil.comunas.length === 0) {
      problemas.push(`${perfil.email}: Faltan comunas`);
      console.log('      ⚠️  PROBLEMA: Faltan comunas');
    }
    
    // Experiencia
    console.log(`   ⏱️  Experiencia: ${perfil.experiencia} años`);
    if (!perfil.experiencia) {
      problemas.push(`${perfil.email}: Falta experiencia`);
      console.log('      ⚠️  PROBLEMA: Falta experiencia');
    }
    
    // Certificaciones
    console.log(`   🏆 Certificaciones: ${perfil.certificaciones || 'N/A'}`);
    
    // Descripción
    console.log(`   📝 Descripción: ${perfil.descripcion ? '✅ Tiene' : '❌ No tiene'}`);
    
    // Foto
    console.log(`   📸 Foto: ${perfil.foto_perfil || '❌ No tiene'}`);
    if (!perfil.foto_perfil) {
      problemas.push(`${perfil.email}: Falta foto`);
      console.log('      ⚠️  PROBLEMA: Falta foto de perfil');
    } else if (perfil.foto_perfil === '/images/admin-profile.jpg') {
      console.log('      ✅ Foto correcta');
    }
    
    // Estado y plan
    console.log(`   🔒 Estado: ${perfil.estado}`);
    if (perfil.estado !== 'activo') {
      problemas.push(`${perfil.email}: Estado no activo (${perfil.estado})`);
      console.log(`      ⚠️  PROBLEMA: Estado es "${perfil.estado}" en lugar de "activo"`);
    } else {
      console.log('      ✅ Estado activo');
    }
    
    console.log(`   💎 Plan: ${perfil.plan}`);
    if (perfil.plan !== 'elite') {
      problemas.push(`${perfil.email}: Plan no es elite (${perfil.plan})`);
      console.log(`      ⚠️  PROBLEMA: Plan es "${perfil.plan}" en lugar de "elite"`);
    } else {
      console.log('      ✅ Plan elite');
    }
    
    // Contraseña
    console.log(`   🔐 Contraseña: ${perfil.password_hash ? '✅ Configurada' : '❌ No configurada'}`);
    if (!perfil.password_hash) {
      problemas.push(`${perfil.email}: Falta contraseña`);
      console.log('      ⚠️  PROBLEMA: No tiene contraseña');
    }
    
    // Estadísticas
    console.log(`   ⭐ Valoración: ${perfil.valoracion}`);
    console.log(`   ✅ Trabajos realizados: ${perfil.trabajos_realizados}`);
    console.log(`   📊 Leads usados: ${perfil.leads_usados}`);
    
    console.log('');
  });

  // 4. Resumen
  console.log('='.repeat(100));
  console.log('\n📊 RESUMEN DEL CHEQUEO:\n');
  console.log(`   ✅ Total de perfiles encontrados: ${perfiles.length}`);
  console.log(`   ${problemas.length === 0 ? '✅' : '⚠️ '} Problemas detectados: ${problemas.length}\n`);

  if (problemas.length > 0) {
    console.log('⚠️  LISTA DE PROBLEMAS:\n');
    problemas.forEach((problema, i) => {
      console.log(`   ${i + 1}. ${problema}`);
    });
  } else {
    console.log('🎉 ¡TODO ESTÁ CORRECTO! No se encontraron problemas.\n');
  }

  // 5. Verificar keywords para búsqueda
  console.log('\n🔍 PASO 4: VERIFICANDO KEYWORDS DE BÚSQUEDA\n');
  console.log('='.repeat(100) + '\n');
  
  const keywords = {
    'Proyectos Fotovoltaicos': ['fotovoltaic', 'solar', 'panel'],
    'carpintería': ['carpint'],
    'arquitectura y diseño de planos': ['plano', 'arquitect', 'diseño'],
    'tramites sec': ['sec', 'tramite', 'certificacion'],
    'Ingeniero Eléctrico': ['electric', 'ingeniero'],
    'Ingeniero': ['ingeniero', 'construccion']
  };

  perfiles.forEach(perfil => {
    console.log(`📋 ${perfil.especialidad}:`);
    const especialidadLower = perfil.especialidad.toLowerCase();
    let encontrado = false;
    
    for (const [tipo, keys] of Object.entries(keywords)) {
      if (tipo.toLowerCase() === especialidadLower) {
        console.log(`   ✅ Palabras clave esperadas: ${keys.join(', ')}`);
        encontrado = true;
        break;
      }
    }
    
    if (!encontrado) {
      console.log(`   ⚠️  Especialidad no coincide con keywords conocidas`);
    }
    console.log('');
  });

  console.log('='.repeat(100));
  console.log('\n✨ CHEQUEO EXHAUSTIVO COMPLETADO\n');
  
  process.exit(0);
}

chequeoExhaustivo();
