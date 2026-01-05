require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function agregarProfesionales() {
  console.log('🚀 Agregando nuevos profesionales...\n');

  const password = await bcrypt.hash('123456', 10);

  const nuevosProfesionales = [
    {
      nombre_completo: 'Carlos Muñoz',
      email: 'carpintero.yfuelaluz@gmail.com',
      password_hash: password,
      telefono: '+56987654321',
      especialidad: 'carpintería',
      comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué'],
      experiencia: 20,
      certificaciones: 'Maestro Carpintero Certificado',
      descripcion: 'Especialista en carpintería fina y muebles a medida. Experto en restauración de muebles antiguos.',
      foto_perfil: '',
      plan: 'premium',
      estado: 'activo',
      valoracion: 4.9,
      trabajos_realizados: 87,
      leads_usados: 5,
      rut: '16789012-3'
    },
    {
      nombre_completo: 'María Torres',
      email: 'planos.yfuelaluz@hotmail.com',
      password_hash: password,
      telefono: '+56976543210',
      especialidad: 'arquitectura y diseño de planos',
      comunas: ['Valparaíso', 'Viña del Mar', 'Concón'],
      experiencia: 12,
      certificaciones: 'Arquitecto Certificado, Especialista en Diseño Estructural',
      descripcion: 'Arquitecta especializada en diseño de planos residenciales y comerciales. Experta en proyectos de construcción.',
      foto_perfil: '',
      plan: 'premium',
      estado: 'activo',
      valoracion: 4.8,
      trabajos_realizados: 124,
      leads_usados: 8,
      rut: '17890123-4'
    },
    {
      nombre_completo: 'Roberto Silva',
      email: 'sec.yfuelaluz@gmail.com',
      password_hash: password,
      telefono: '+56965432109',
      especialidad: 'tramites sec y certificaciones electricas',
      comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
      experiencia: 18,
      certificaciones: 'Instalador Eléctrico Clase A SEC, Certificador Autorizado',
      descripcion: 'Especialista en trámites SEC, certificaciones eléctricas y normativas. Asesoría completa en instalaciones eléctricas.',
      foto_perfil: '',
      plan: 'premium',
      estado: 'activo',
      valoracion: 5.0,
      trabajos_realizados: 203,
      leads_usados: 12,
      rut: '18901234-5'
    },
    {
      nombre_completo: 'Andrea Parra',
      email: 'fotovoltaico.yfuelaluz@hotmail.com',
      password_hash: password,
      telefono: '+56954321098',
      especialidad: 'proyectos fotovoltaicos y energia solar',
      comunas: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué'],
      experiencia: 10,
      certificaciones: 'Instalador Fotovoltaico Certificado, Especialista en Energías Renovables',
      descripcion: 'Ingeniera especializada en sistemas fotovoltaicos residenciales y comerciales. Diseño e instalación de paneles solares.',
      foto_perfil: '',
      plan: 'premium',
      estado: 'activo',
      valoracion: 4.9,
      trabajos_realizados: 156,
      leads_usados: 10,
      rut: '19012345-6'
    }
  ];

  for (const prof of nuevosProfesionales) {
    const { data, error } = await supabase
      .from('profesionales')
      .insert([prof])
      .select();

    if (error) {
      console.error(`❌ Error al agregar ${prof.nombre_completo}:`, error.message);
    } else {
      console.log(`✅ Agregado: ${prof.nombre_completo} - ${prof.especialidad}`);
    }
  }

  console.log('\n✅ Proceso completado!');
  process.exit(0);
}

agregarProfesionales();
