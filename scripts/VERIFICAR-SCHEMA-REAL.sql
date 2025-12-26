-- Script para verificar el schema REAL de la tabla profesionales en Supabase
-- Ejecuta esto en Supabase SQL Editor para saber exactamente qué columnas existen

SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'profesionales'
ORDER BY ordinal_position;
