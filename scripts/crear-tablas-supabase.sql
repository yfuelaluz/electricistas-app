-- ============================================================
-- SCHEMA COMPLETO PARA ELECTRICISTA-APP-V2
-- Base de datos PostgreSQL en Supabase
-- Todas las columnas en snake_case
-- ============================================================

-- Tabla de Profesionales
CREATE TABLE IF NOT EXISTS profesionales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  password_hash TEXT NOT NULL,
  especialidad VARCHAR(100),
  descripcion TEXT,
  ciudad VARCHAR(100),
  region VARCHAR(100),
  foto_perfil TEXT,
  calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
  total_resenas INTEGER DEFAULT 0,
  total_trabajos INTEGER DEFAULT 0,
  verificado BOOLEAN DEFAULT FALSE,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('activo', 'pendiente', 'suspendido', 'rechazado')),
  tipo_plan VARCHAR(50) DEFAULT 'profesional-basico' CHECK (tipo_plan IN ('profesional-basico', 'profesional-pro', 'profesional-elite')),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_suspension TIMESTAMP WITH TIME ZONE,
  razon_suspension TEXT
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  password_hash TEXT NOT NULL,
  ciudad VARCHAR(100),
  region VARCHAR(100),
  foto_perfil TEXT,
  tipo_plan VARCHAR(50) DEFAULT 'cliente-basico' CHECK (tipo_plan IN ('cliente-basico', 'cliente-premium', 'cliente-empresa')),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  profesional_id UUID REFERENCES profesionales(id) ON DELETE CASCADE,
  tipo_servicio VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  ubicacion VARCHAR(255),
  ciudad VARCHAR(100),
  region VARCHAR(100),
  urgencia VARCHAR(20) DEFAULT 'normal' CHECK (urgencia IN ('baja', 'normal', 'alta', 'urgente')),
  presupuesto_estimado DECIMAL(12,2),
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondida', 'aceptada', 'rechazada', 'completada', 'cancelada')),
  respuesta_profesional TEXT,
  monto_ofertado DECIMAL(12,2),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta TIMESTAMP WITH TIME ZONE,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reseñas
CREATE TABLE IF NOT EXISTS resenas (
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

-- Tabla de Cartera (Portfolio)
CREATE TABLE IF NOT EXISTS cartera (
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

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_profesionales_email ON profesionales(email);
CREATE INDEX IF NOT EXISTS idx_profesionales_estado ON profesionales(estado);
CREATE INDEX IF NOT EXISTS idx_profesionales_especialidad ON profesionales(especialidad);
CREATE INDEX IF NOT EXISTS idx_profesionales_ciudad ON profesionales(ciudad);

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);

CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente_id ON cotizaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_profesional_id ON cotizaciones(profesional_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_fecha_creacion ON cotizaciones(fecha_creacion);

CREATE INDEX IF NOT EXISTS idx_resenas_profesional_id ON resenas(profesional_id);
CREATE INDEX IF NOT EXISTS idx_resenas_cliente_id ON resenas(cliente_id);

CREATE INDEX IF NOT EXISTS idx_cartera_profesional_id ON cartera(profesional_id);

-- Trigger para actualizar ultima_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ultima_actualizacion = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profesionales_actualizacion
  BEFORE UPDATE ON profesionales
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_clientes_actualizacion
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_cotizaciones_actualizacion
  BEFORE UPDATE ON cotizaciones
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

-- Función para actualizar calificación promedio de profesionales
CREATE OR REPLACE FUNCTION actualizar_calificacion_profesional()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profesionales
  SET 
    calificacion_promedio = (
      SELECT COALESCE(AVG(calificacion), 0)
      FROM resenas
      WHERE profesional_id = COALESCE(NEW.profesional_id, OLD.profesional_id)
    ),
    total_resenas = (
      SELECT COUNT(*)
      FROM resenas
      WHERE profesional_id = COALESCE(NEW.profesional_id, OLD.profesional_id)
    )
  WHERE id = COALESCE(NEW.profesional_id, OLD.profesional_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_calificacion
  AFTER INSERT OR UPDATE OR DELETE ON resenas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_calificacion_profesional();

-- Comentarios para documentación
COMMENT ON TABLE profesionales IS 'Tabla principal de profesionales electricistas';
COMMENT ON TABLE clientes IS 'Tabla principal de clientes que solicitan servicios';
COMMENT ON TABLE cotizaciones IS 'Tabla de solicitudes y cotizaciones de trabajos';
COMMENT ON TABLE resenas IS 'Tabla de reseñas y calificaciones de profesionales';
COMMENT ON TABLE cartera IS 'Tabla de portfolio/trabajos anteriores de profesionales';

-- Fin del script
