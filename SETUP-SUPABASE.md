# 🗄️ Configuración de Supabase (Base de Datos)

## ¿Por qué Supabase?
- ✅ PostgreSQL gratis hasta 500MB
- ✅ Auth integrado
- ✅ Storage para imágenes
- ✅ API REST automática
- ✅ Realtime subscriptions
- ✅ Escalable

## 🚀 Paso 1: Crear Proyecto

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Sign up con GitHub o email
4. Crea una **New Organization** (ej: "ELIENAI")
5. Crea un **New Project**:
   - Name: `electricistas-app`
   - Database Password: (guarda esto, lo necesitarás)
   - Region: **South America (São Paulo)** (más cercano a Chile)
   - Plan: **Free**
6. Espera 2 minutos mientras se crea

## 🔑 Paso 2: Obtener Credenciales

En tu proyecto Supabase:
1. Ve a **Settings** (⚙️) → **API**
2. Copia estas 2 cosas:

**Project URL:**
```
https://tuproyecto.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

## 📝 Paso 3: Agregar Variables de Entorno

Abre tu archivo `.env.local` y agrega al final:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗂️ Paso 4: Crear Tablas

En Supabase, ve a **SQL Editor** y ejecuta este script:

```sql
-- Tabla de profesionales
CREATE TABLE profesionales (
  id SERIAL PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  telefono TEXT,
  especialidad TEXT,
  experiencia INTEGER DEFAULT 0,
  descripcion TEXT,
  ubicacion TEXT,
  plan TEXT DEFAULT 'starter',
  activo BOOLEAN DEFAULT false,
  valoracion DECIMAL(2,1) DEFAULT 0,
  trabajos_realizados INTEGER DEFAULT 0,
  certificaciones TEXT[],
  tarifa_minima INTEGER,
  tarifa_maxima INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  telefono TEXT,
  direccion TEXT,
  comuna TEXT,
  plan TEXT DEFAULT 'cliente-basico',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de cotizaciones
CREATE TABLE cotizaciones (
  id TEXT PRIMARY KEY,
  fecha TIMESTAMP DEFAULT NOW(),
  cliente_id INTEGER REFERENCES clientes(id),
  cliente_data JSONB NOT NULL,
  servicio JSONB NOT NULL,
  presupuesto JSONB,
  estado TEXT DEFAULT 'pendiente',
  respuestas JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  profesional_id INTEGER REFERENCES profesionales(id) ON DELETE CASCADE,
  cliente_id INTEGER REFERENCES clientes(id),
  cotizacion_id TEXT,
  valoracion INTEGER CHECK (valoracion >= 1 AND valoracion <= 5),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de portfolio
CREATE TABLE portfolio (
  id TEXT PRIMARY KEY,
  profesional_id INTEGER REFERENCES profesionales(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  categoria TEXT NOT NULL,
  imagenes TEXT[] DEFAULT '{}',
  ubicacion TEXT,
  duracion TEXT,
  destacado BOOLEAN DEFAULT false,
  fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_profesionales_email ON profesionales(email);
CREATE INDEX idx_profesionales_plan ON profesionales(plan);
CREATE INDEX idx_profesionales_activo ON profesionales(activo);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizaciones_fecha ON cotizaciones(fecha DESC);
CREATE INDEX idx_reviews_profesional ON reviews(profesional_id);
CREATE INDEX idx_portfolio_profesional ON portfolio(profesional_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_profesionales_updated_at BEFORE UPDATE ON profesionales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cotizaciones_updated_at BEFORE UPDATE ON cotizaciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## ✅ Paso 5: Verificar

1. Ve a **Table Editor** en Supabase
2. Deberías ver 5 tablas:
   - ✅ profesionales
   - ✅ clientes
   - ✅ cotizaciones
   - ✅ reviews
   - ✅ portfolio

## 🔐 Paso 6: Configurar Políticas de Seguridad (RLS)

En SQL Editor, ejecuta:

```sql
-- Habilitar RLS
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Políticas para profesionales (público puede leer activos, solo owner puede editar)
CREATE POLICY "Profesionales activos son públicos"
  ON profesionales FOR SELECT
  USING (activo = true);

CREATE POLICY "Profesionales pueden actualizar su perfil"
  ON profesionales FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Políticas para clientes (solo owner puede ver/editar)
CREATE POLICY "Clientes pueden ver su perfil"
  ON clientes FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Clientes pueden actualizar su perfil"
  ON clientes FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Políticas para cotizaciones (públicas para lectura básica)
CREATE POLICY "Cotizaciones son públicas"
  ON cotizaciones FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear cotizaciones"
  ON cotizaciones FOR INSERT
  WITH CHECK (true);

-- Políticas para reviews (públicas)
CREATE POLICY "Reviews son públicas"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Clientes pueden crear reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Políticas para portfolio (público)
CREATE POLICY "Portfolio es público"
  ON portfolio FOR SELECT
  USING (true);

CREATE POLICY "Profesionales pueden gestionar su portfolio"
  ON portfolio FOR ALL
  USING (auth.uid()::text = profesional_id::text);
```

## 🔄 Paso 7: Migrar Datos Existentes (Opcional)

Si tienes datos en los archivos JSON, ejecutaremos un script para migrarlos.

## 📦 Siguiente Paso

Una vez configurado Supabase, continuaremos con:
- Actualizar los endpoints API para usar Supabase
- Configurar Supabase Storage para imágenes
- Sistema de autenticación con Supabase Auth

---

**¿Listo?** Una vez hayas completado estos pasos, avísame y continuamos con la integración.
