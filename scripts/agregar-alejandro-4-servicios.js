require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function agregarAlejandro() {
  console.log('🚀 Agregando Alejandro Fernández en 4 especialidades...\n');

  const password = await bcrypt.hash('123456', 10);

  const profesionales = [
    {
      nombre_completo: 'Alejandro Fernández',
      email: 'yfuelaluz+carpintero@gmail.com',
      password_hash: password,
      telefono: '+56995748162',
      especialidad: 'carpintería',
      comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
      experiencia: 20,
      certificaciones: 'Maestro Carpintero Certificado, Especialista en Muebles a Medida',
      descripcion: 'Especialista en carpintería fina, muebles a medida y restauración. Más de 20 años de experiencia en proyectos residenciales y comerciales.',
      foto_perfil: '',
      plan: 'elite',
      estado: 'activo',
      valoracion: 5.0,
      trabajos_realizados: 87,
      leads_usados: 5,
      rut: '12345678-9'
    },
    {
      nombre_completo: 'Alejandro Fernández',
      email: 'yfuelaluz+planos@hotmail.com',
      password_hash: password,
      telefono: '+56995748162',
      especialidad: 'arquitectura y diseño de planos',
      comunas: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué'],
      experiencia: 12,
      certificaciones: 'Arquitecto Certificado, Especialista en Proyectos Estructurales',
      descripcion: 'Diseño de planos arquitectónicos para proyectos residenciales, comerciales e industriales. Especialista en proyectos de construcción.',
      foto_perfil: '',
      plan: 'elite',
      estado: 'activo',
      valoracion: 5.0,
      trabajos_realizados: 124,
      leads_usados: 8,
      rut: '12345678-9'
    },
    {
      nombre_completo: 'Alejandro Fernández',
      email: 'yfuelaluz+sec@gmail.com',
      password_hash: password,
      telefono: '+56995748162',
      especialidad: 'tramites sec y certificaciones eléctricas',
      comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
      experiencia: 18,
      certificaciones: 'Instalador Eléctrico Clase A SEC, Certificador Autorizado por SEC',
      descripcion: 'Especialista en trámites y certificaciones SEC. Asesoría completa en normativas eléctricas chilenas y gestión de permisos.',
      foto_perfil: '',
      plan: 'elite',
      estado: 'activo',
      valoracion: 5.0,
      trabajos_realizados: 203,
      leads_usados: 12,
      rut: '12345678-9'
    },
    {
      nombre_completo: 'Alejandro Fernández',
      email: 'yfuelaluz+fotovoltaico@hotmail.com',
      password_hash: password,
      telefono: '+56995748162',
      especialidad: 'proyectos fotovoltaicos y energía solar',
      comunas: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana'],
      experiencia: 10,
      certificaciones: 'Instalador Fotovoltaico Certificado, Especialista en Energías Renovables ERNC',
      descripcion: 'Diseño e instalación de sistemas fotovoltaicos residenciales y comerciales. Especialista en proyectos de energía solar on-grid y off-grid.',
      foto_perfil: '',
      plan: 'elite',
      estado: 'activo',
      valoracion: 5.0,
      trabajos_realizados: 156,
      leads_usados: 10,
      rut: '12345678-9'
    }
  ];

  for (const prof of profesionales) {
    const { data, error } = await supabase
      .from('profesionales')
      .insert([prof])
      .select();

    if (error) {
      console.error(`❌ Error: ${prof.especialidad}:`, error.message);
    } else {
      console.log(`✅ Agregado: ${prof.especialidad}`);
      console.log(`   📧 ${prof.email}`);
      console.log(`   ⭐ ${prof.valoracion} estrellas | 🔨 ${prof.trabajos_realizados} trabajos`);
      console.log('');
    }
  }

  console.log('✅ Proceso completado!\n');
  console.log('📝 IMPORTANTE:');
  console.log('   Los emails con "+" son alias que llegarán a tu buzón principal.');
  console.log('   Gmail: yfuelaluz+carpintero@gmail.com → yfuelaluz@gmail.com');
  console.log('   Hotmail: yfuelaluz+planos@hotmail.com → yfuelaluz@hotmail.com\n');
  
  process.exit(0);
}

agregarAlejandro();
