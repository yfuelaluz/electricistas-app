-- VERIFICACIÓN EXHAUSTIVA DEL SCHEMA DE TODAS LAS TABLAS
-- Ejecuta esto en Supabase SQL Editor

-- 1. TABLA PROFESIONALES - Schema completo
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profesionales'
ORDER BY ordinal_position;

-- 2. TABLA CLIENTES - Schema completo
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'clientes'
ORDER BY ordinal_position;

-- 3. TABLA COTIZACIONES - Schema completo
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'cotizaciones'
ORDER BY ordinal_position;

-- 4. TABLA REVIEWS - Schema completo
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'reviews'
ORDER BY ordinal_position;

-- 5. TABLA PORTFOLIO - Schema completo
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'portfolio'
ORDER BY ordinal_position;
