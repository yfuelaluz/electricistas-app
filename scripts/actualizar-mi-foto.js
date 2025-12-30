const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarFoto() {
  try {
    console.log('🔄 Actualizando foto de perfil de Alejandro Fernández...');

    // Actualizar en la tabla profesionales
    const { data, error } = await supabase
      .from('profesionales')
      .update({ 
        foto_perfil: '/images/Profesional-icon.jpg'
      })
      .eq('email', 'yfuelaluz@gmail.com');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Foto actualizada exitosamente');
    console.log('📸 Nueva ruta: /images/Profesional-icon.jpg');
    
  } catch (err) {
    console.error('❌ Error fatal:', err);
  }
}

actualizarFoto();
