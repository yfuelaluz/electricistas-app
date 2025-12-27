-- ============================================================
-- SCHEMA COMPLETO Y DEFINITIVO PARA ELECTRICISTAS-APP
-- Base de datos PostgreSQL en Supabase (Virginia, USA)
-- Fecha: 26 diciembre 2025
-- ============================================================

-- ELIMINAR TABLAS EXISTENTES (CASCADE para evitar errores de dependencias)
DROP TABLE IF EXISTS cartera CASCADE;
DROP TABLE IF EXISTS resenas CASCADE;
DROP TABLE IF NOT EXISTS cotizaciones CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS profesionales CASCADE;

-- ============================================================
-- TABLA: PROFESIONALES
-- ============================================================
CREATE TABLE profesionales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Datos personales
  nombre_completo VARCHAR(255) NOT NULL,
  rut VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  password_hash TEXT NOT NULL,
  
  -- Datos profesionales
  especialidad VARCHAR(100),
  comunas TEXT[],
  experiencia INTEGER DEFAULT 0,
  certificaciones TEXT,
  descripcion TEXT,
  foto_perfil TEXT,
  
  -- Plan y estado
  plan VARCHAR(50) DEFAULT 'starter' CHECK (plan IN ('starter', 'profesional-basico', 'profesional-pro', 'profesional-elite')),
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('activo', 'pendiente', 'suspendido', 'rechazado')),
  
  -- Métricas
  valoracion DECIMAL(3,2) DEFAULT 0.00,
  trabajos_realizados INTEGER DEFAULT 0,
  leads_usados INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: CLIENTES
-- ============================================================
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Datos personales
  nombre_completo VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  password_hash TEXT NOT NULL,
  
  -- Ubicación
  direccion VARCHAR(255),
  comuna VARCHAR(100),
  
  -- Plan y estado
  plan VARCHAR(50) DEFAULT 'cliente-basico' CHECK (plan IN ('cliente-basico', 'cliente-premium', 'cliente-empresa')),
  estado VARCHAR(20) DEFAULT 'activo',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: COTIZACIONES
-- ============================================================
CREATE TABLE cotizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Datos del cliente (JSONB para flexibilidad)
  cliente JSONB NOT NULL,
  
  -- Datos del servicio (JSONB para flexibilidad)
  servicio JSONB NOT NULL,
  
  -- Presupuesto
  presupuesto JSONB,
  
  -- Estado
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondida', 'aceptada', 'rechazada', 'completada', 'cancelada')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: RESEÑAS (para futuro)
-- ============================================================
CREATE TABLE resenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id UUID REFERENCES profesionales(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE SET NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario TEXT,
  respuesta_profesional TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta TIMESTAMP WITH TIME ZONE,
  verificado BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- TABLA: CARTERA/PORTFOLIO (para futuro)
-- ============================================================
CREATE TABLE cartera (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id UUID REFERENCES profesionales(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT NOT NULL,
  categoria VARCHAR(100),
  fecha_trabajo DATE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  orden INTEGER DEFAULT 0
);

-- ============================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================

-- Profesionales
CREATE INDEX idx_profesionales_email ON profesionales(email);
CREATE INDEX idx_profesionales_estado ON profesionales(estado);
CREATE INDEX idx_profesionales_especialidad ON profesionales(especialidad);
CREATE INDEX idx_profesionales_plan ON profesionales(plan);

-- Clientes
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_estado ON clientes(estado);

-- Cotizaciones
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizaciones_created_at ON cotizaciones(created_at);

-- Reseñas
CREATE INDEX idx_resenas_profesional_id ON resenas(profesional_id);
CREATE INDEX idx_resenas_cliente_id ON resenas(cliente_id);

-- Cartera
CREATE INDEX idx_cartera_profesional_id ON cartera(profesional_id);

-- ============================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================
COMMENT ON TABLE profesionales IS 'Tabla principal de profesionales electricistas registrados';
COMMENT ON TABLE clientes IS 'Tabla principal de clientes que solicitan servicios';
COMMENT ON TABLE cotizaciones IS 'Tabla de solicitudes y cotizaciones de trabajos';
COMMENT ON TABLE resenas IS 'Tabla de reseñas y calificaciones de profesionales';
COMMENT ON TABLE cartera IS 'Tabla de portfolio/trabajos anteriores de profesionales';

-- ============================================================
-- NOTA IMPORTANTE
-- ============================================================
-- Las tablas usan snake_case en las columnas porque es estándar en PostgreSQL
-- El backend transforma automáticamente a camelCase usando la función toCamelCase()
-- antes de enviar datos al frontend
-- ============================================================
