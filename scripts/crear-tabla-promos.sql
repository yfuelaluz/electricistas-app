-- Crear tabla de códigos promocionales
CREATE TABLE IF NOT EXISTS codigos_promocionales (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  porcentaje_descuento INTEGER NOT NULL,
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP NOT NULL,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar la promoción 2X1
INSERT INTO codigos_promocionales (codigo, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin, activa)
VALUES (
  '2X1',
  '¡2 meses por el precio de 1!',
  50,
  '2026-01-01 00:00:00',
  '2026-01-31 23:59:59',
  true
)
ON CONFLICT (codigo) 
DO UPDATE SET
  descripcion = EXCLUDED.descripcion,
  porcentaje_descuento = EXCLUDED.porcentaje_descuento,
  fecha_inicio = EXCLUDED.fecha_inicio,
  fecha_fin = EXCLUDED.fecha_fin,
  activa = EXCLUDED.activa;

-- Agregar columna promo_code a profesionales
ALTER TABLE profesionales 
ADD COLUMN IF NOT EXISTS promo_code TEXT,
ADD COLUMN IF NOT EXISTS promo_registered_at TIMESTAMP;

-- Agregar columna promo_code a clientes
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS promo_code TEXT,
ADD COLUMN IF NOT EXISTS promo_registered_at TIMESTAMP;

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_profesionales_promo ON profesionales(promo_code) 
WHERE promo_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_clientes_promo ON clientes(promo_code) 
WHERE promo_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_codigos_promocionales_activa ON codigos_promocionales(codigo, activa)
WHERE activa = true;

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
COMMENT ON TABLE codigos_promocionales IS 'Códigos promocionales activos y sus configuraciones';
COMMENT ON COLUMN profesionales.promo_code IS 'Código promocional usado en el registro';
COMMENT ON COLUMN clientes.promo_code IS 'Código promocional usado en el registro';
