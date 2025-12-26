-- Script para agregar columnas faltantes a la tabla profesionales
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna rut
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS rut TEXT;

-- 2. Agregar columna comunas (array de texto)
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS comunas TEXT[];

-- 3. Agregar columna estado (pendiente, activo, inactivo)
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente';

-- 4. Agregar columna foto_perfil
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS foto_perfil TEXT;

-- 5. Agregar columna leads_usados
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS leads_usados INTEGER DEFAULT 0;

-- Verificar que se agregaron correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profesionales' 
  AND column_name IN ('rut', 'comunas', 'estado', 'foto_perfil', 'leads_usados')
ORDER BY column_name;
