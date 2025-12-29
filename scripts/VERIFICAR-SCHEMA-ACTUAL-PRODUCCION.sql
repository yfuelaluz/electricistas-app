-- ============================================================
-- SCRIPT: VERIFICAR SCHEMA REAL EN PRODUCCIÓN
-- ============================================================
-- Ejecuta este script en Supabase SQL Editor para verificar
-- el schema actual de la base de datos en producción.
-- ============================================================

-- 1️⃣ VERIFICAR TABLAS EXISTENTES
-- ============================================================
SELECT 
    table_name AS "Tabla",
    CASE 
        WHEN table_name IN ('profesionales', 'clientes', 'cotizaciones', 'resenas', 'cartera') 
        THEN '✅' 
        ELSE '⚠️' 
    END AS "Estado"
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;


-- 2️⃣ SCHEMA COMPLETO DE PROFESIONALES
-- ============================================================
SELECT 
    ordinal_position AS "#",
    column_name AS "Columna",
    data_type AS "Tipo",
    CASE 
        WHEN is_nullable = 'YES' THEN 'Opcional'
        ELSE 'Requerido'
    END AS "Nullable",
    column_default AS "Default"
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'profesionales'
ORDER BY ordinal_position;


-- 3️⃣ SCHEMA COMPLETO DE CLIENTES
-- ============================================================
SELECT 
    ordinal_position AS "#",
    column_name AS "Columna",
    data_type AS "Tipo",
    CASE 
        WHEN is_nullable = 'YES' THEN 'Opcional'
        ELSE 'Requerido'
    END AS "Nullable",
    column_default AS "Default"
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'clientes'
ORDER BY ordinal_position;


-- 4️⃣ SCHEMA COMPLETO DE COTIZACIONES
-- ============================================================
SELECT 
    ordinal_position AS "#",
    column_name AS "Columna",
    data_type AS "Tipo",
    CASE 
        WHEN is_nullable = 'YES' THEN 'Opcional'
        ELSE 'Requerido'
    END AS "Nullable",
    column_default AS "Default"
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'cotizaciones'
ORDER BY ordinal_position;


-- 5️⃣ VERIFICAR ÍNDICES
-- ============================================================
SELECT 
    tablename AS "Tabla",
    indexname AS "Índice",
    indexdef AS "Definición"
FROM pg_indexes 
WHERE schemaname = 'public'
    AND tablename IN ('profesionales', 'clientes', 'cotizaciones', 'resenas', 'cartera')
ORDER BY tablename, indexname;


-- 6️⃣ VERIFICAR POLÍTICAS RLS
-- ============================================================
SELECT 
    tablename AS "Tabla",
    policyname AS "Política",
    permissive AS "Tipo",
    cmd AS "Comando"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;


-- 7️⃣ CONTAR REGISTROS EN CADA TABLA
-- ============================================================
SELECT 
    'profesionales' AS tabla, 
    COUNT(*) AS registros,
    COUNT(*) FILTER (WHERE estado = 'activo') AS activos,
    COUNT(*) FILTER (WHERE estado = 'pendiente') AS pendientes
FROM profesionales
UNION ALL
SELECT 
    'clientes' AS tabla, 
    COUNT(*) AS registros,
    COUNT(*) FILTER (WHERE estado = 'activo') AS activos,
    0 AS pendientes
FROM clientes
UNION ALL
SELECT 
    'cotizaciones' AS tabla, 
    COUNT(*) AS registros,
    COUNT(*) FILTER (WHERE estado = 'pendiente') AS activos,
    COUNT(*) FILTER (WHERE estado = 'completada') AS pendientes
FROM cotizaciones;


-- 8️⃣ VERIFICAR COLUMNAS CRÍTICAS EN PROFESIONALES
-- ============================================================
-- Estas columnas deben existir para que la app funcione
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profesionales' AND column_name = 'nombre_completo'
        ) THEN '✅ nombre_completo existe'
        ELSE '❌ nombre_completo NO EXISTE'
    END AS check_nombre,
    
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profesionales' AND column_name = 'foto_perfil'
        ) THEN '✅ foto_perfil existe'
        ELSE '❌ foto_perfil NO EXISTE'
    END AS check_foto,
    
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profesionales' AND column_name = 'trabajos_realizados'
        ) THEN '✅ trabajos_realizados existe'
        ELSE '❌ trabajos_realizados NO EXISTE'
    END AS check_trabajos,
    
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profesionales' AND column_name = 'leads_usados'
        ) THEN '✅ leads_usados existe'
        ELSE '❌ leads_usados NO EXISTE'
    END AS check_leads,
    
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profesionales' AND column_name = 'rut'
        ) THEN '✅ rut existe'
        ELSE '❌ rut NO EXISTE'
    END AS check_rut,
    
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profesionales' AND column_name = 'comunas'
        ) THEN '✅ comunas existe'
        ELSE '❌ comunas NO EXISTE'
    END AS check_comunas;


-- ============================================================
-- ✅ VERIFICACIÓN COMPLETA
-- ============================================================
-- Si todas las verificaciones muestran ✅, el schema está correcto.
-- Si encuentras ❌, ejecuta las migraciones necesarias desde:
-- scripts/schema-completo-final.sql
-- ============================================================
