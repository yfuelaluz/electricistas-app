-- ========================================
-- SCRIPT DE VERIFICACIÓN Y CORRECCIÓN COMPLETO
-- Fecha: 26 de diciembre de 2025
-- ========================================

-- PARTE 1: VERIFICAR COLUMNAS EXISTENTES
-- ========================================

DO $$ 
DECLARE
    v_count INTEGER;
BEGIN
    RAISE NOTICE '🔍 VERIFICANDO SCHEMA DE PROFESIONALES...';
    
    -- Verificar cada columna
    SELECT COUNT(*) INTO v_count 
    FROM information_schema.columns 
    WHERE table_name = 'profesionales' AND column_name = 'rut';
    
    IF v_count = 0 THEN
        RAISE NOTICE '❌ Columna rut NO existe';
    ELSE
        RAISE NOTICE '✅ Columna rut existe';
    END IF;
    
    SELECT COUNT(*) INTO v_count 
    FROM information_schema.columns 
    WHERE table_name = 'profesionales' AND column_name = 'comunas';
    
    IF v_count = 0 THEN
        RAISE NOTICE '❌ Columna comunas NO existe';
    ELSE
        RAISE NOTICE '✅ Columna comunas existe';
    END IF;
    
    SELECT COUNT(*) INTO v_count 
    FROM information_schema.columns 
    WHERE table_name = 'profesionales' AND column_name = 'estado';
    
    IF v_count = 0 THEN
        RAISE NOTICE '❌ Columna estado NO existe';
    ELSE
        RAISE NOTICE '✅ Columna estado existe';
    END IF;
    
    SELECT COUNT(*) INTO v_count 
    FROM information_schema.columns 
    WHERE table_name = 'profesionales' AND column_name = 'foto_perfil';
    
    IF v_count = 0 THEN
        RAISE NOTICE '❌ Columna foto_perfil NO existe';
    ELSE
        RAISE NOTICE '✅ Columna foto_perfil existe';
    END IF;
    
    SELECT COUNT(*) INTO v_count 
    FROM information_schema.columns 
    WHERE table_name = 'profesionales' AND column_name = 'leads_usados';
    
    IF v_count = 0 THEN
        RAISE NOTICE '❌ Columna leads_usados NO existe';
    ELSE
        RAISE NOTICE '✅ Columna leads_usados existe';
    END IF;
END $$;

-- PARTE 2: AGREGAR COLUMNAS FALTANTES
-- ========================================

-- Agregar columnas si no existen
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS rut TEXT;
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS comunas TEXT[];
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente';
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS foto_perfil TEXT;
ALTER TABLE profesionales ADD COLUMN IF NOT EXISTS leads_usados INTEGER DEFAULT 0;

-- PARTE 3: VERIFICACIÓN FINAL
-- ========================================

-- Ver schema completo de profesionales
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name IN ('rut', 'comunas', 'estado', 'foto_perfil', 'leads_usados') 
        THEN '✨ NUEVO'
        ELSE ''
    END as status
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profesionales'
ORDER BY ordinal_position;

-- PARTE 4: VERIFICAR DATOS EXISTENTES
-- ========================================

-- Ver cuántos profesionales hay
SELECT 
    COUNT(*) as total_profesionales,
    COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
    COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes,
    COUNT(CASE WHEN rut IS NOT NULL THEN 1 END) as con_rut,
    COUNT(CASE WHEN comunas IS NOT NULL THEN 1 END) as con_comunas
FROM profesionales;

-- Ver algunos profesionales de ejemplo
SELECT 
    id,
    nombre_completo,
    email,
    estado,
    rut,
    comunas,
    foto_perfil,
    leads_usados,
    created_at
FROM profesionales
LIMIT 5;

-- PARTE 5: VERIFICAR CLIENTES
-- ========================================

SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'clientes'
ORDER BY ordinal_position;

-- PARTE 6: VERIFICAR COTIZACIONES
-- ========================================

SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'cotizaciones'
ORDER BY ordinal_position;

-- PARTE 7: VERIFICAR REVIEWS
-- ========================================

SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'reviews'
ORDER BY ordinal_position;

-- PARTE 8: VERIFICAR PORTFOLIO
-- ========================================

SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'portfolio'
ORDER BY ordinal_position;

-- ========================================
-- ✅ SCRIPT COMPLETADO
-- ========================================
