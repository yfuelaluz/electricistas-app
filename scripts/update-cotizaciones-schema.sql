-- Actualizar la tabla cotizaciones para usar JSONB correctamente
-- Ejecutar esto en el SQL Editor de Supabase si es necesario

-- Si la tabla ya existe, verificar que tenga estas columnas
ALTER TABLE IF EXISTS cotizaciones 
  ALTER COLUMN cliente TYPE jsonb USING cliente::jsonb,
  ALTER COLUMN servicio TYPE jsonb USING servicio::jsonb,
  ALTER COLUMN presupuesto TYPE jsonb USING presupuesto::jsonb;

-- Agregar columna de fecha si no existe
ALTER TABLE IF EXISTS cotizaciones 
  ADD COLUMN IF NOT EXISTS createdAt timestamptz DEFAULT now();

-- Crear índice para búsquedas por email del cliente
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente_email 
  ON cotizaciones ((cliente->>'email'));

-- Crear índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado 
  ON cotizaciones (estado);

-- Crear índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_cotizaciones_fecha 
  ON cotizaciones (createdAt DESC);
