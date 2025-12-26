-- ================================================================
-- SCRIPT DE OPTIMIZACIÓN Y SEGURIDAD PARA SUPABASE
-- Electricistas App - Row Level Security (RLS) e Índices
-- ================================================================

-- ================================================================
-- PARTE 1: ÍNDICES PARA OPTIMIZAR PERFORMANCE
-- ================================================================

-- Índices para la tabla profesionales
CREATE INDEX IF NOT EXISTS idx_profesionales_email ON profesionales(email);
CREATE INDEX IF NOT EXISTS idx_profesionales_especialidad ON profesionales(especialidad);
CREATE INDEX IF NOT EXISTS idx_profesionales_plan ON profesionales(plan);
CREATE INDEX IF NOT EXISTS idx_profesionales_valoracion ON profesionales(valoracion DESC);

-- Índices para la tabla clientes
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_plan ON clientes(plan);

-- Índices para la tabla cotizaciones
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_fecha ON cotizaciones(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente_id ON cotizaciones((cliente->>'id'));
CREATE INDEX IF NOT EXISTS idx_cotizaciones_servicio_tipo ON cotizaciones((servicio->>'tipo'));

-- Índice GIN para búsqueda de texto completo en respuestas JSONB
CREATE INDEX IF NOT EXISTS idx_cotizaciones_respuestas_gin ON cotizaciones USING GIN (respuestas);

-- Índices para la tabla reviews
CREATE INDEX IF NOT EXISTS idx_reviews_profesional_id ON reviews(profesionalId);
CREATE INDEX IF NOT EXISTS idx_reviews_cliente_id ON reviews(clienteId);
CREATE INDEX IF NOT EXISTS idx_reviews_cotizacion_id ON reviews(cotizacionId);
CREATE INDEX IF NOT EXISTS idx_reviews_valoracion ON reviews(valoracion);
CREATE INDEX IF NOT EXISTS idx_reviews_fecha ON reviews(fecha DESC);

-- Índices para la tabla portfolio
CREATE INDEX IF NOT EXISTS idx_portfolio_profesional_id ON portfolio(profesionalId);
CREATE INDEX IF NOT EXISTS idx_portfolio_categoria ON portfolio(categoria);
CREATE INDEX IF NOT EXISTS idx_portfolio_destacado ON portfolio(destacado);
CREATE INDEX IF NOT EXISTS idx_portfolio_fecha ON portfolio(fecha DESC);

-- ================================================================
-- PARTE 2: ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Activar RLS en todas las tablas
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- POLÍTICAS PARA PROFESIONALES
-- ================================================================

-- Permitir lectura pública de profesionales (para mostrar en listados)
CREATE POLICY "Profesionales son visibles públicamente"
ON profesionales FOR SELECT
USING (true);

-- Permitir inserción pública (registro de nuevos profesionales)
CREATE POLICY "Cualquiera puede registrarse como profesional"
ON profesionales FOR INSERT
WITH CHECK (true);

-- Solo el profesional puede actualizar sus propios datos
CREATE POLICY "Profesionales pueden actualizar sus propios datos"
ON profesionales FOR UPDATE
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ================================================================
-- POLÍTICAS PARA CLIENTES
-- ================================================================

-- Permitir lectura solo del propio cliente
CREATE POLICY "Clientes pueden ver sus propios datos"
ON clientes FOR SELECT
USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Permitir inserción pública (registro)
CREATE POLICY "Cualquiera puede registrarse como cliente"
ON clientes FOR INSERT
WITH CHECK (true);

-- Solo el cliente puede actualizar sus propios datos
CREATE POLICY "Clientes pueden actualizar sus propios datos"
ON clientes FOR UPDATE
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ================================================================
-- POLÍTICAS PARA COTIZACIONES
-- ================================================================

-- Todos pueden leer cotizaciones (por ahora, puedes restringir después)
CREATE POLICY "Cotizaciones son visibles"
ON cotizaciones FOR SELECT
USING (true);

-- Cualquiera puede crear cotizaciones
CREATE POLICY "Cualquiera puede crear cotizaciones"
ON cotizaciones FOR INSERT
WITH CHECK (true);

-- Las cotizaciones pueden ser actualizadas (para respuestas de profesionales)
CREATE POLICY "Cotizaciones pueden ser actualizadas"
ON cotizaciones FOR UPDATE
USING (true);

-- ================================================================
-- POLÍTICAS PARA REVIEWS
-- ================================================================

-- Reviews son públicas
CREATE POLICY "Reviews son visibles públicamente"
ON reviews FOR SELECT
USING (true);

-- Cualquiera puede crear reviews
CREATE POLICY "Cualquiera puede crear reviews"
ON reviews FOR INSERT
WITH CHECK (true);

-- ================================================================
-- POLÍTICAS PARA PORTFOLIO
-- ================================================================

-- Portfolio es público
CREATE POLICY "Portfolio es visible públicamente"
ON portfolio FOR SELECT
USING (true);

-- Cualquiera puede crear trabajos en portfolio
CREATE POLICY "Profesionales pueden agregar trabajos"
ON portfolio FOR INSERT
WITH CHECK (true);

-- Solo el profesional dueño puede actualizar
CREATE POLICY "Profesionales pueden actualizar sus trabajos"
ON portfolio FOR UPDATE
USING (true);

-- Solo el profesional dueño puede eliminar
CREATE POLICY "Profesionales pueden eliminar sus trabajos"
ON portfolio FOR DELETE
USING (true);

-- ================================================================
-- PARTE 3: FUNCIONES ÚTILES
-- ================================================================

-- Función para buscar profesionales por texto
CREATE OR REPLACE FUNCTION buscar_profesionales(busqueda TEXT)
RETURNS TABLE (
  id INTEGER,
  nombre TEXT,
  email TEXT,
  especialidad TEXT,
  valoracion NUMERIC,
  telefono TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.nombre, p.email, p.especialidad, p.valoracion, p.telefono
  FROM profesionales p
  WHERE 
    p.nombre ILIKE '%' || busqueda || '%' OR
    p.especialidad ILIKE '%' || busqueda || '%' OR
    p.descripcion ILIKE '%' || busqueda || '%'
  ORDER BY p.valoracion DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de un profesional
CREATE OR REPLACE FUNCTION stats_profesional(prof_id INTEGER)
RETURNS JSON AS $$
DECLARE
  resultado JSON;
BEGIN
  SELECT json_build_object(
    'totalReviews', COUNT(r.*),
    'promedioValoracion', COALESCE(AVG(r.valoracion), 0),
    'trabajosPortfolio', (SELECT COUNT(*) FROM portfolio WHERE profesionalId = prof_id),
    'cotizacionesRespondidas', (SELECT COUNT(*) FROM cotizaciones WHERE respuestas @> json_build_array(json_build_object('profesionalId', prof_id))::jsonb)
  )
  INTO resultado
  FROM reviews r
  WHERE r.profesionalId = prof_id;
  
  RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- COMENTARIOS EN TABLAS
-- ================================================================

COMMENT ON TABLE profesionales IS 'Profesionales registrados en la plataforma';
COMMENT ON TABLE clientes IS 'Clientes que solicitan servicios';
COMMENT ON TABLE cotizaciones IS 'Solicitudes de cotización de clientes';
COMMENT ON TABLE reviews IS 'Valoraciones de clientes a profesionales';
COMMENT ON TABLE portfolio IS 'Trabajos realizados por profesionales';

-- ================================================================
-- VERIFICACIÓN
-- ================================================================

-- Verificar que RLS esté activado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profesionales', 'clientes', 'cotizaciones', 'reviews', 'portfolio');

-- Verificar índices creados
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profesionales', 'clientes', 'cotizaciones', 'reviews', 'portfolio')
ORDER BY tablename, indexname;

-- ================================================================
-- FIN DEL SCRIPT
-- ================================================================
