import { createClient } from '@supabase/supabase-js';

// Verificar que las variables de entorno estén configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase no configurado. Usando modo JSON legacy.');
}

// Crear cliente de Supabase (con valores por defecto para evitar errores)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper: Verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Helper: Manejar errores de Supabase
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  return {
    success: false,
    error: error.message || 'Error desconocido',
  };
};

// Helper: Respuesta exitosa
export const handleSupabaseSuccess = (data: any) => {
  return {
    success: true,
    data,
  };
};
