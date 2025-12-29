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

> **IMPORTANTE:** Este es el schema actualizado y en uso en producción.
> Usa **UUID** para IDs y **snake_case** para columnas (convención PostgreSQL).
> La aplicación convierte automáticamente a camelCase en el frontend.

```sql
-- ============================================================
-- SCHEMA OFICIAL - ACTUALIZADO 2025
-- ============================================================

-- ELIMINAR TABLAS EXISTENTES (solo si necesitas recrear)
-- DROP TABLE IF EXISTS cartera CASCADE;
-- DROP TABLE IF EXISTS resenas CASCADE;
-- DROP TABLE IF EXISTS cotizaciones CASCADE;
-- DROP TABLE IF EXISTS clientes CASCADE;
-- DROP TABLE IF EXISTS profesionales CASCADE;

-- ============================================================
-- TABLA: PROFESIONALES
-- ============================================================
CREATE TABLE IF NOT EXISTS profesionales (
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
  plan VARCHAR(50) DEFAULT 'starter' CHECK (plan IN ('starter', 'profesional', 'profesional-elite', 'profesional-pro', 'empresarial')),
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('activo', 'pendiente', 'suspendido', 'inactivo')),
  
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
CREATE TABLE IF NOT EXISTS clientes (
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
CREATE TABLE IF NOT EXISTS cotizaciones (
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
-- TABLA: RESEÑAS (REVIEWS)
-- ============================================================
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

-- ============================================================
-- TABLA: CARTERA/PORTFOLIO
-- ============================================================
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

-- ============================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================

-- Profesionales
CREATE INDEX IF NOT EXISTS idx_profesionales_email ON profesionales(email);
CREATE INDEX IF NOT EXISTS idx_profesionales_estado ON profesionales(estado);
CREATE INDEX IF NOT EXISTS idx_profesionales_especialidad ON profesionales(especialidad);
CREATE INDEX IF NOT EXISTS idx_profesionales_plan ON profesionales(plan);

-- Clientes
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes(estado);

-- Cotizaciones
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_created_at ON cotizaciones(created_at);

-- Reseñas
CREATE INDEX IF NOT EXISTS idx_resenas_profesional_id ON resenas(profesional_id);
CREATE INDEX IF NOT EXISTS idx_resenas_cliente_id ON resenas(cliente_id);

-- Cartera
CREATE INDEX IF NOT EXISTS idx_cartera_profesional_id ON cartera(profesional_id);

-- ============================================================
-- ✅ SCHEMA COMPLETO - Listo para usar
-- ============================================================
```

## ✅ Paso 5: Verificar

1. Ve a **Table Editor** en Supabase
2. Deberías ver 5 tablas:
   - ✅ profesionales
   - ✅ clientes
   - ✅ cotizaciones
   - ✅ resenas (reseñas/reviews)
   - ✅ cartera (portfolio)

**Verificar columnas de profesionales:**
Ejecuta en SQL Editor para confirmar el schema:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profesionales' 
ORDER BY ordinal_position;
```

Deberías ver columnas en **snake_case**: `nombre_completo`, `foto_perfil`, `trabajos_realizados`, etc.

> **Nota:** La app convierte automáticamente a camelCase usando la función `toCamelCase()` en todas las APIs.

## 🔐 Paso 6: Configurar Políticas de Seguridad (RLS)

> **IMPORTANTE:** Las políticas actuales están simplificadas para desarrollo.
> En producción, considera políticas más estrictas.

En SQL Editor, ejecuta:

```sql
-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Políticas de Seguridad
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartera ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS PROFESIONALES
-- ============================================================

-- Lectura: Profesionales activos son públicos
CREATE POLICY "Profesionales activos públicos"
  ON profesionales FOR SELECT
  USING (estado = 'activo');

-- Lectura: Admin puede ver todos
CREATE POLICY "Admin ve todos los profesionales"
  ON profesionales FOR SELECT
  USING (true);

-- Inserción: Cualquiera puede registrarse
CREATE POLICY "Registro de profesionales público"
  ON profesionales FOR INSERT
  WITH CHECK (true);

-- Actualización: Solo propietario
CREATE POLICY "Profesional actualiza su perfil"
  ON profesionales FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- POLÍTICAS CLIENTES
-- ============================================================

-- Lectura: Solo propietario
CREATE POLICY "Cliente ve su perfil"
  ON clientes FOR SELECT
  USING (auth.uid() = id);

-- Inserción: Cualquiera puede registrarse
CREATE POLICY "Registro de clientes público"
  ON clientes FOR INSERT
  WITH CHECK (true);

-- Actualización: Solo propietario
CREATE POLICY "Cliente actualiza su perfil"
  ON clientes FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- POLÍTICAS COTIZACIONES
-- ============================================================

-- Lectura: Todas públicas (cambiar en producción si es necesario)
CREATE POLICY "Cotizaciones públicas"
  ON cotizaciones FOR SELECT
  USING (true);

-- Inserción: Cualquiera puede crear
CREATE POLICY "Crear cotizaciones público"
  ON cotizaciones FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- POLÍTICAS RESEÑAS
-- ============================================================

-- Lectura: Todas públicas
CREATE POLICY "Reseñas públicas"
  ON resenas FOR SELECT
  USING (true);

-- Inserción: Cualquiera puede crear (validar en app)
CREATE POLICY "Crear reseñas público"
  ON resenas FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- POLÍTICAS PORTFOLIO/CARTERA
-- ============================================================

-- Lectura: Todo público
CREATE POLICY "Portfolio público"
  ON cartera FOR SELECT
  USING (true);

-- Inserción/Actualización: Solo propietario
CREATE POLICY "Profesional gestiona su portfolio"
  ON cartera FOR ALL
  USING (auth.uid() = profesional_id);

-- ============================================================
-- ✅ SEGURIDAD CONFIGURADA
-- ============================================================
```

> **Nota de Seguridad:** Estas políticas permiten operaciones sin autenticación para facilitar el desarrollo inicial. Para producción, considera:
> - Requerir autenticación para crear cotizaciones
> - Limitar acceso a datos sensibles
> - Implementar roles (admin, profesional, cliente)

## 🔄 Paso 7: Migrar Datos Existentes (Opcional)

Si tienes datos en los archivos JSON, ejecutaremos un script para migrarlos.

## 📦 Siguiente Paso

Una vez configurado Supabase, continuaremos con:
- Actualizar los endpoints API para usar Supabase
- Configurar Supabase Storage para imágenes
- Sistema de autenticación con Supabase Auth

---

**¿Listo?** Una vez hayas completado estos pasos, avísame y continuamos con la integración.
