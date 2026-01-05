-- Script para agregar soporte de código promocional a las tablas

-- Agregar columna promo_code a profesionales
ALTER TABLE profesionales 
ADD COLUMN IF NOT EXISTS promo_code TEXT,
ADD COLUMN IF NOT EXISTS promo_registered_at TIMESTAMP;

-- Agregar columna promo_code a clientes
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS promo_code TEXT,
ADD COLUMN IF NOT EXISTS promo_registered_at TIMESTAMP;

-- Índices para mejorar rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_profesionales_promo ON profesionales(promo_code) 
WHERE promo_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_clientes_promo ON clientes(promo_code) 
WHERE promo_code IS NOT NULL;

-- Vista para estadísticas de promoción
CREATE OR REPLACE VIEW promo_stats AS
SELECT 
  'profesionales' as tipo,
  promo_code,
  COUNT(*) as total,
  MIN(promo_registered_at) as primer_registro,
  MAX(promo_registered_at) as ultimo_registro
FROM profesionales
WHERE promo_code IS NOT NULL
GROUP BY promo_code
UNION ALL
SELECT 
  'clientes' as tipo,
  promo_code,
  COUNT(*) as total,
  MIN(promo_registered_at) as primer_registro,
  MAX(promo_registered_at) as ultimo_registro
FROM clientes
WHERE promo_code IS NOT NULL
GROUP BY promo_code;

-- Comentarios
COMMENT ON COLUMN profesionales.promo_code IS 'Código promocional usado en el registro (ej: 2x1)';
COMMENT ON COLUMN clientes.promo_code IS 'Código promocional usado en el registro (ej: 2x1)';
