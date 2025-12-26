-- Script para verificar estructura exacta de tabla profesionales
-- Y agregar columna fotoPerfil si no existe

-- 1. Ver estructura actual
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profesionales'
ORDER BY ordinal_position;

-- 2. Si fotoPerfil NO existe, agregarla:
-- ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS fotoPerfil TEXT;
